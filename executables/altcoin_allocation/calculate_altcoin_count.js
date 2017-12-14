"use strict";
/*
 * Altcoin Bonus Conversion Calculation
 *
 * * Author: Aman
 * * Date: 11/12/2017
 * * Reviewed by:
 *
 * node calculate_altcoin_count.js
 *
 */

const readline = require('readline')
    , bigNumber = require('bignumber.js')
    , helper = require('../token_allocation/helper')
    , fs = require('fs');

const altcoinCalculation = {

    calculateBonus: function (data, tokenDetails) {

        return new Promise(function (onResolve, onReject) {

            var totalEntries = data.length;
            var parsedData = [];
            for (var i = 0; i < totalEntries; i++) {

                // Continue if blank value
                if (!data[i] || data[i] == '') {
                    continue;
                }

                var bonusData = data[i],
                    receiverAddr = bonusData[0].trim(),
                    tokenContractAddress = bonusData[1].trim(),
                    bonusEthAmountInWei = new bigNumber(bonusData[2].trim());

                var tokenData = tokenDetails[tokenContractAddress];

                var altcoinTokenInWei = bonusEthAmountInWei.times(tokenData.ethToTokenRatio).floor().toNumber();

                parsedData.push([receiverAddr, tokenContractAddress, bonusEthAmountInWei, altcoinTokenInWei]);
            }

            onResolve(parsedData);
        });
    },

    calculateTokenConversionRation: function (data) {

        return new Promise(function (onResolve, onReject) {

            var totalEntries = data.length;
            var tokenDetails = {};

            for (var i = 0; i < totalEntries; i++) {

                var topkenData = data[i],
                    tokenContractAddress = topkenData[0].trim(),
                    totalEthSentInWei = new bigNumber(topkenData[1].trim()),
                    totalTokensReceivedInWei = new bigNumber(topkenData[2].trim());

                var ethToTokenRatio = totalTokensReceivedInWei.dividedBy(totalEthSentInWei);

                tokenDetails[tokenContractAddress] = ethToTokenRatio;

            }

            onResolve(tokenDetails);
        });
    },

    writeToCsv: async function(csvData) {
        var stream = fs.createWriteStream("altCoinBonusResults.csv");
        stream.once('open', function (fd) {
            csvData.forEach(function (csvData) {
                stream.write(csvData[0] + "," + csvData[1] + "," + csvData[2] + "," + csvData[3] + "\n");
            });
            stream.end();
        });
    },

    perform: async function() {

        // check conversion rate unit if wei/eth ??

        const altcoinPurchasefilePath = "../../data/altcoin_purchase_data.csv"
        var altcoinPurchaseCsvData = await helper.readCsv(altcoinPurchasefilePath);

        var tokenDetails = await altcoinCalculation.calculateTokenConversionRation(altcoinPurchaseCsvData);

        const altcoinBonusfilePath = "../../data/altcoin_allocations.csv"
        var altcoinBonusCsvData = await helper.readCsv(altcoinBonusfilePath);

        var altcoinBonusOutputData = await altcoinCalculation.calculateBonus(altcoinBonusCsvData, tokenDetails);

        console.log('Writing to Csv total count:' + altcoinBonusOutputData.length);

        await altcoinCalculation.writeToCsv(altcoinBonusOutputData);
    }

};

altcoinCalculation.perform();