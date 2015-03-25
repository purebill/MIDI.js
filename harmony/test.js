 "use strict";
 
var tuning = new Tuning([
    Note.fromString("E4"),
    Note.fromString("B3"),
    Note.fromString("G3"),
    Note.fromString("D3"),
    Note.fromString("A2"),
    Note.fromString("E2")
].map(function (note) {
    return note.midiCode;
}));

function ChordIntervals(intervals, name, pattern) {
    this.intervals = intervals;
    this.name = name;
    this.postfix = pattern.substr(1);
}

ChordIntervals.prototype.nameFor = function (rootMidiCode) {
    if (rootMidiCode instanceof Note) {
        rootMidiCode = rootMidiCode.midiCode;
    }
    
    var note = new Note(rootMidiCode);
    return note.toString(true) + this.postfix;
};

// see http://en.wikipedia.org/wiki/Augmented_triad ("Further reading" section)
var chordIntervals = [
    new ChordIntervals([4, 3], "major", "C"),
    new ChordIntervals([3, 4], "minor", "Cm"),
    new ChordIntervals([3, 3], "diminished", "Cdim"),
    new ChordIntervals([4, 4], "augmented", "Caug"),
    
    new ChordIntervals([4, 3, 4], "major7", "Cmaj7"),
    new ChordIntervals([3, 4, 3], "minor7", "Cm7"),
    new ChordIntervals([4, 3, 3], "dominant7", "C7"),
    new ChordIntervals([4, 2, 4], "dominant7b5", "C7b5"),
    new ChordIntervals([3, 3, 3], "diminished7", "C07"),
    new ChordIntervals([3, 3, 4], "half-diminished7", "Cm7b5"),
    new ChordIntervals([3, 3, 5], "diminished-major7", "C0maj7"),
    new ChordIntervals([3, 4, 4], "minor-major7", "Cm/M7"),
    new ChordIntervals([4, 4, 3], "augmented-major7", "CM7/#5"),
    new ChordIntervals([4, 4, 2], "augmented-minor7", "C7#5"),

    new ChordIntervals([4, 3, 1], "major6", "C6"),
    new ChordIntervals([3, 4, 1], "minor6", "Cm6"),

    new ChordIntervals([4, 3, 4, 3], "major9", "Cmaj9"),
    new ChordIntervals([3, 4, 3, 4], "minor9", "Cm9"),
    new ChordIntervals([4, 3, 3, 4], "dominant9", "C9"),

    new ChordIntervals([4, 7, 3], "major9", "Cmaj9"),
    new ChordIntervals([3, 7, 4], "minor9", "Cm9"),
    new ChordIntervals([4, 6, 4], "dominant9", "C9")
];

function unique(array) {
    var result = [];
    array.forEach(function (e) {
        if (result.indexOf(e) === -1) {
            result.push(e);
        }
    });
    return result;
}

function arraysEqual(a1, a2) {
    if (a1.length !== a2.length) {
        return false;
    }
    
    for (var i = 0; i < a1.length; i++) {
        if (a1[i] !== a2[i]) {
            return false;
        }
    }
    
    return true;
}

function match(chord) {
    var midiCodes = unique(chord.notes.map(function (note) { return note.midiCode; }));
    
    var permutations = [];
    for (var i = 0; i < midiCodes.length; i++) {
        var root = midiCodes[i];
        permutations.push(unique(
            midiCodes.map(function (midiCode) {
                var diff = midiCode - root;
                return diff < 0
                    ? diff + Math.ceil(Math.abs(diff)/12)*12
                    : diff % 12;
            })
            .sort(function (a, b) { return a - b; })
        ));
    }
    //console.debug("permutations", permutations);
    
    var matches = [];
    chordIntervals.forEach(function (chordIntervals) {
        var positions = [0];
        var position = 0;
        chordIntervals.intervals.forEach(function (interval) {
            position += interval;
            positions.push(position % 12);
        });
        
        positions.sort(function (a, b) { return a - b; });
        
        permutations.forEach(function (permutation, i) {
            if (arraysEqual(positions, permutation)) {
                matches.push(chordIntervals.nameFor(chord.notes[i].midiCode));
                //console.debug("chordIntervals.intervals", chordIntervals.intervals);
                //console.debug("matching permutations, positions", permutation, positions);
                //console.debug(chord.notes[i]);
                //console.debug(chordIntervals.nameFor(chord.notes[i].midiCode));
            }
        });
    });
    
    return unique(matches);
}

var scale = Scale.diatonic(Note.fromString("A"), 5);
scale.notes.forEach(function (note) {
    console.debug(note.toString(), match(Chord.make4(note, scale)));
});

var chord = new Chord([
    new Note(tuning.midiCodeAt(0, 2)),
    new Note(tuning.midiCodeAt(1, 4)),
    new Note(tuning.midiCodeAt(2, 3)),
    //new Note(tuning.midiCodeAt(3, 2)),
    new Note(tuning.midiCodeAt(4, 3)),
    //new Note(tuning.midiCodeAt(5, 2))
]);
console.debug(chord.toString(), match(chord));
//console.debug(chord.transpose(2).toString(), match(chord.transpose(2)));
//console.debug(chord.transpose(4).toString(), match(chord.transpose(4)));
