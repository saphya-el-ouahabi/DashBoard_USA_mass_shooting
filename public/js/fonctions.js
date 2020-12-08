//fonction pour attribuer une couleur aux états en fonction du nombre de meurtre
function reducevalue(value) {

    if (value <= 10) {
        value = 0;
    } else if (value <= 30) {
        value = 1;
    } else if (value <= 50) {
        value = 2;
    } else if (value <= 100) {
        value = 3;
    } else if (value <= 150) {
        value = 4;
    } else {
        value = 5;
    }
    return value
}


//récupère les données d'un état
function getStateData(state, data) {

    let ret = [];
    let local = JSON.parse(JSON.stringify(data));
    local.forEach(function (d) {
        if (d.State == state) {
            ret.push(d);
        }
    });
    return ret;
}