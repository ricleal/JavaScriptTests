/*
Takes a range in form of "a-b" and generate a list of numbers between a and b inclusive.
Also accepts comma separated ranges like "a-b,c-d,f" will build a list which will include
Numbers from a to b, a to d and f
*/

function hyphen_range(str) {
    var out = [],
        chunks = str.split(',')
        l = chunks.length;

    for ( i = 0; i < l; i++ ) {
        populate(out, chunks[i]);
    }

    return out.sort(function(a,b){return a - b});

    function populate (list, chunk) {
        var ends = chunk.split('-');

        if ( ends.length == 1 ) return list.push(+chunk);
        
        if ( ends[0] > ends[1] ) flip(ends);

        while ( ends[0] <= ends[1] ) {
            list.push(+ends[0]);
            ends[0]++;
        }
    }
    
    function flip (list) {
        var temp = list[0];
        list[0] = list[1];
        list[1] = temp;
    }
}
