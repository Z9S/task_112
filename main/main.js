'use strict';
const loadAllItems = require("./datbase.js").loadAllItems;
const loadPromotions = require("./datbase.js").loadPromotions;

function printInventory(inputs) {
    var List = get_List(inputs);
    var items = get_goods_payNumber(List);
    var sumPrice = 0;
    var savePrice = 0;
    var i;

    var printInfo = "***<没钱赚商店>购物清单***\n";

    for(i = 0; i < items.length; i++) {
        printInfo += "名称："+ items[i].name + "，数量："+ items[i].num +
            items[i].unit + "，单价：" + items[i].price.toFixed(2) + "(元)，小计：" +
            (items[i].price * items[i].paidNum).toFixed(2) + "(元)\n" ;
        sumPrice += items[i].price * items[i].paidNum;
    }

    printInfo += "----------------------\n" +"挥泪赠送商品：\n";
    for(i = 0; i < items.length; i++){
        if(items[i].freeNum > 0) {
            printInfo += "名称：" + items[i].name + "，数量：" + items[i].freeNum + items[i].unit + "\n";
            savePrice += items[i].price * items[i].freeNum;
        }
    }
    printInfo += "----------------------\n";
    printInfo += "总计：" + sumPrice.toFixed(2) + "(元)\n" + "节省：" + (savePrice).toFixed(2) + "(元)\n";
    printInfo += "**********************";

    console.log(printInfo);
}

//创建一个购买清单，记录顾客的购买信息
function get_List (inputs) {
    var item = loadAllItems();
    var items = [];
    var m = -1;

    for (var i = 0; i < inputs.length; i++) {
        for (var j = 0; j < item.length; j++) {
            if (item[j].barcode === inputs[i].substr(0, 10)) {
                if (inputs[i].indexOf('-') !== -1) {
                    m++;
                    items[m] = item[j];
                    items[m].num = parseInt(inputs[i].substr(inputs[i].indexOf('-') + 1));
                }
                else {
                    if (i >= 1 && inputs[i] === inputs[i - 1]) {
                        items[m].num++;
                    }
                    else {
                        m++;
                        items[m] = item[j];
                        items[m].num = 1;
                    }
                }
            }
        }
    }
    return items;
}

//判断商品是否参与优惠，如果参与优惠，计算优惠之后需要支付的实际数目
function get_goods_payNumber (List) {
   var Promotions = loadPromotions()[0].barcodes;
   for (var i = 0; i < List.length; i++) {
       for (var j = 0; j < Promotions.length; j++) {
           if (List[i].barcode === Promotions[j]) {
                   List[i].freeNum = parseInt(List[i].num / 3);
                   List[i].paidNum = List[i].num - List[i].freeNum;
                   break;
           }
       }
       if (j === Promotions.length) {
           List[i].freeNum = 0;
           List[i].paidNum = List[i].num;
       }
   }
   return List;
}

module.exports = printInventory;