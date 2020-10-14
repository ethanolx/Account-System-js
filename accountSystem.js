"use strict";
let input = require("readline-sync");
let valid;
let encodeCh = "*";
let terminationCode = "no";
let accounts = new Array([null]);
let accNumsLeft = new Array(5);

for (let i = 0; i < accNumsLeft.length; i++) {
    accNumsLeft[i] = i + 1;
}

function formatString(string, capitalise) {
    string.trim();
    let words = string.split(" ");
    for (let i = 0; i < words.length; i++) {
        let word = words[i].trim().toLowerCase();
        if (capitalise) {
            let firstLetter = word[0];
            word = firstLetter.toUpperCase() + word.substr(1);
        }
        words[i] = word;
    }
    let wordsStr = "";
    for (let word of words) {
        wordsStr += word + " ";
    }
    return wordsStr;
}

function terminateSession() {
    console.log("This session has been terminated. Goodbye! :)");
}

function newAccNum() {
    let nextAccNum = accNumsLeft[0];
    accNumsLeft.splice(0, 1);
    return nextAccNum;
}

function createNewPW(length, tries) {
    let tryNum = 1;
    do {
        let passwordArr = new Array();
        var password = "";
        valid = "true";
        passwordArr = input.question("Password: ").trim().split(" ");
        if (passwordArr.length > 1) {
            console.log("Password cannot contain white spaces!");
            valid = false;
        }
        else {
            password = passwordArr[0];
            if (password.length < length) {
                console.log(`Password is too short! (${password.length}/${length} characters)`);
                valid = false;
            }
            if (password.toLowerCase() === password) {
                console.log("Password must contain at least one uppercase letter!");
                valid = false;
            }
            if (password.toUpperCase() === password) {
                console.log("Password must contain at least one lowercase letter!");
                valid = false;
            }
            let hasNum = false;
            for (let ch of password) {
                let digitArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
                if (digitArr.includes(ch)) {
                    hasNum = true;
                    break;
                }
            }
            if (!hasNum) {
                console.log("Password must contain at least one number!");
                valid = false;
            }
        }
        if (valid) {
            tryNum = tries + 1;
        }
        else {
            tryNum++;
        }
    } while (tryNum <= tries);
    if (valid) {
        return password;
    }
    else {
        console.log("You have exahusted all your tries...");
    }
}

function confirmPW(length, confirmTries, passwordTries) {
    let tryNum = 1;
    let password;
    let cfmPW = "";
    valid = true;
    password = createNewPW(length, passwordTries);
    if (valid) {
        do {
            valid = false;
            cfmPW = input.question("Confirm password: ").trim();
            if (cfmPW === password) {
                tryNum = confirmTries + 1;
                valid = true;
            }
            else {
                console.log("Your passwords do not match!");
                tryNum++;
            }
        } while (tryNum <= confirmTries);
        if (valid) {
            return password;
        }
        else {
            console.log("You have exahusted all your tries...");
        }
    }
}

function getAmount(dp, minimum = 0, maximum = 10000) {
    let amt = input.questionFloat("> $").toFixed(dp);
    if (amt < minimum) {
        console.log(`Amount cannot be less than ${minimum}!`);
        valid = false;
    }
    else if (amt > maximum) {
        console.log(`Amount cannot be less than ${maximum}!`);
        valid = false;
    }
    else {
        return parseFloat(amt);
    }
}

function depositFunds(accNum) {
    console.log("How much do you wish to deposit?\n(Minimum $10; maximum $100)");
    accounts[accNum][2] = (accounts[accNum][2] + getAmount(2, 10, 100));
}

function withdrawFunds(accNum) {
    console.log("How much do you wish to withdraw?\n(Minimum $10; maximum $100)");
    let withdrawal = getAmount(2, 10, 100);
    if (accounts[accNum][2] < withdrawal) {
        console.log("You do not have sufficient funds to withdraw $" + withdrawal + "!");
    }
    else {
        accounts[accNum][2] = (accounts[accNum][2] - getAmount(2, 10, 100));
    }
}

function checkAccBal(accNum) {
    console.log(`${accounts[accNum][0]}, you have $${accounts[accNum][2]} remaining in your account.`);
}

function createNewAcc() {
    let accName = formatString(input.question("\nName: ").trim().toLowerCase(), true);
    let accPW = confirmPW(8, 3, 3);
    if (valid) {
        console.log("Do you wish to deposit any money into your account now?\n(if not, enter $0)");
        let accBal = getAmount(2);
        if (valid) {
            let accNum = newAccNum();
            accounts.push([accName, accPW, accBal]);
            let password = "";
            for (let ch of accPW) {
                password += encodeCh;
            }
            console.log("\nHere is a copy of your registration receipt...");
            console.log(`Account Number: ${accNum}`);
            console.log(`Name: ${accName}`);
            console.log(`Password: ${password}`);
            console.log(`Account Balance: $${accBal}`);
        }
        else {
            terminateSession();
        }
    }
    else {
        terminateSession();
    }
}

function openExistingAcc() {
    let accNum = input.questionInt("\nAccount Number: ");
    if (accNum > 0) {
        if (!(accNumsLeft.includes(accNum))) {
            do {
                var userName = formatString(input.question("Name: ").trim().toLowerCase(), true);
                if (userName === accounts[accNum][0]) {
                    let userPW = input.question("Password: ").trim();
                    if (userPW === accounts[accNum][1].trim()) {
                        do {
                            console.log("\nWhat do you wish to do? (Enter the corresponding integer to your option)");
                            console.log("Actions:\n\t0) Exit\n\t1) Deposit Funds\n\t2) Withdraw Funds\n\t3) Check Account Balance");
                            try {
                                var action = input.questionInt("\nAction: ");
                                if (action < 0) {
                                    throw "negative";
                                }
                                if (action > 3) {
                                    throw "larger than 3";
                                }
                                switch (action) {
                                    case 0:
                                        break;
                                    case 1:
                                        depositFunds(accNum);
                                        break;
                                    case 2:
                                        withdrawFunds(accNum);
                                        break;
                                    case 3:
                                        checkAccBal(accNum);
                                        break;
                                }
                            }
                            catch (err) {
                                console.log(`Invalid input! Action cannot be ${err}.`);
                            }
                        } while (action != 0);
                    }
                    else {
                        console.log("Incorrect password!");
                        terminateSession();
                    }
                }
                else {
                    console.log("Your name does not match your registered one!");
                }
            } while (userName !== accounts[accNum][0]);
        }
        else if (accNum > accNumsLeft.length) {
            console.log("This account does not exist!");
            terminateSession();
        }
        else {
            console.log("This account has not yet been activated!");
            terminateSession();
        }
    }
    else {
        console.log("There is no such account!");
        terminateSession();
    }
}

// program
do {
    console.log("\nDo you have an existing account?");
    let hasExistingAcc = input.question("> ").trim().toLowerCase();
    if (hasExistingAcc == "yes") {
        openExistingAcc();
    }
    else if (hasExistingAcc == "no") {
        if (accNumsLeft.length == 0) {
            console.log("Sorry, there are no more available accounts that can be activated");
        }
        else {
            createNewAcc();
        }
    }
    else {
        console.log("\nPleaase enter \"yes\" or \"no\" only!");
    }
    var cont = input.question("\nContinue?\n> ");
} while (cont !== terminationCode);
console.log(accounts);