define(function(){
    "use strict";

    var Gameshark = {};

    var mc;

    var codes = [];

    Gameshark.reset = function(){
        codes = [];
    }

    Gameshark.setMemoryController = function(m){
        mc = m;
    }

    Gameshark.applyCodes = function(){
        for (var i = 0, li = codes.length; i < li; i++){
            var code = codes[i];
            switch (code.address & 0xF000){
                case 0xA000:
                case 0xB000:
                    mc.writeRAMByte(code.address, code.ramBankNum, code.newData,false);
                    break;
                default:
                    mc.writeByte(code.address, code.newData,false);
                    break;
            }
        }
    }

    Gameshark.removeCode = function(code){
        for (var i = 0, li = codes.length; i < li; i++){
            if (codes[i].code == code){
                codes.splice(i,1);
                break;
            }
        }
    }

    Gameshark.addCode = function(code){
        if (code.length != 8)
            return false;
        for (var i = 0, li = codes.length; i < li; i++){ //no duplicates
            if (codes[i].code == code){
                return false;
            }
        }
        codes.push({
            rawCode: code.toUpperCase(),
            ramBankNum:  parseInt(code.substring(0,2), 16),
            newData: parseInt(code.substring(2,4), 16),
            address: parseInt(code.substring(6,8) + code.substring(4,6), 16),
            code: code
        });
        return true;
    }

    Gameshark.getCodeList = function(){
        var result = [];
        for (var i = 0, li = codes.length; i < li; i++){
            result.push(codes[i].code);
        }
        return result;
    }

    return Gameshark;

});