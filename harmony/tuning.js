(function () { "use strict";
    function Tuning(stringToMidiCode) {
        if (!stringToMidiCode instanceof Array) {
            throw new Error("stringToMidiCode must be array");
        }
        
        this.stringToMidiCode = stringToMidiCode;
        this.stringsCount = stringToMidiCode.length;
        this.fretsCount = 24;
        
        this.midiCodeToStrings = {};
        for (var fret = 0; fret < this.fretsCount; fret++) {
            for (var string = 0; string < this.stringsCount; string++) {
                var midiCode = this.stringToMidiCode[string] + fret;
                
                if (!this.midiCodeToStrings[midiCode]) {
                    this.midiCodeToStrings[midiCode] = {};
                }
                
                this.midiCodeToStrings[midiCode][string] = fret;
            }
        }
    }
    
    Tuning.prototype.fretsFor = function(midiCode) {
        return this.midiCodeToStrings[midiCode];
    };
    
    Tuning.prototype.midiCodeAt = function(string, fret) {
        if (string < 0 || string >= this.stringToMidiCode.length) {
            throw new Error("Bad string: " + string);
        }
        if (fret < 0) {
            throw new Error("Bad fret: " + fret);
        }
        
        return this.stringToMidiCode[string] + fret;
    };
    
    // export
    window.Tuning = Tuning;
})();