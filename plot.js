const data = {
    '1': {
        x: [],
        y: [],
        mode: 'markers',
        type: 'scatter',
        name: '1+ Samples',
        text: [],
        marker: {
            size: 10
        }
    },

    '2': {
        x: [],
        y: [],
        mode: 'markers',
        type: 'scatter',
        name: '10+ Samples',
        text: [],
        marker: {
            size: 10
        }
    },

    '3': {
        x: [],
        y: [],
        mode: 'markers',
        type: 'scatter',
        name: '100+ Samples',
        text: [],
        marker: {
            size: 10
        }
    },

    '4': {
        x: [],
        y: [],
        mode: 'markers',
        type: 'scatter',
        name: '1000+ Samples',
        text: [],
        marker: {
            size: 10
        }
    },

    '5': {
        x: [],
        y: [],
        mode: 'markers',
        type: 'scatter',
        name: '10000+ Samples',
        text: [],
        marker: {
            size: 10
        }
    },

    'intel': {
        x: [],
        y: [],
        mode: 'markers',
        type: 'scatter',
        name: 'Intel',
        text: [],
        marker: {
            size: 1
        }
    },

    'amd': {
        x: [],
        y: [],
        mode: 'markers',
        type: 'scatter',
        name: 'AMD',
        text: [],
        marker: {
            size: 1
        }
    }
}

filter = (cpu) => {
    options = {
        "AMD": true,
        "Intel": true,
        "colorByVendor": true,
        "exactcores": false,
        "name": null,
        "cores": 0,
        "threads": 0,
        "samples": 100,
        "onlymobile": false, // true excludes non-mobile
        "nooverclockable": false // false excludes overclocking, true includes both
    }

    ocTable = ["K", "X", "HK", "XM"];
    ocCPU = ["G3258", "Athlon"];
    ocSocket = ["AM3+", "FM2+", "AM4"];
    mobileCPU = ["M", "U", "H", "HK", "XM", "G", "QE", "QM", "Y", "HQ", "ME", "UE", "LE"];
    noMobileSockets = [
        "AM2",
        "AM2+",
        "AM3",
        "G34",
        "C32",
        "FM1",
        "AM3+",
        "FM2",
        "FM2+",
        "AM1",
        "AM4",
        "SP3",
        "TR4",
        "FT1",
        "LGA"
    ];

    intelRegex = /[0-9]{3,4}([A-Z]{1,2})/
    coreRegex = /Core2?[ Duo]? ([A-Z]{1,2})[0-9]{3,4}/

    if (cpu.CPU.includes("AMD") && !options.AMD) return false;
    if ((cpu.CPU.includes("Intel") || cpu.CPU.includes("Celeron")) && !options.Intel) return false;
    if (options.cores > 0 && ((!options.exactcores && cpu.cores < options.cores) || options.exactcores && cpu.cores !== options.cores)) return false;
    if (options.threads > 0 && cpu.threads < options.threads) return false;
    if (options.samples > 0 && cpu.samples < options.samples) return false;
    if (options.name && !cpu.CPU.includes(options.name)) return false;
    if (options.nooverclockable) {
        for (chip in ocCPU) {
            if (cpu.CPU.includes(ocCPU[chip])) return false;
        }
        if (options.Intel && (intelRegex.test(cpu.CPU) && ocTable.includes(cpu.CPU.match(intelRegex)[1]))) return false;
        if (options.AMD && (ocSocket.includes(cpu.socket) || cpu.CPU.includes("Athlon"))) return false;
    }
    if (options.onlymobile) {
        for (socket in noMobileSockets) {
            if (cpu.socket && !cpu.socket.includes("BGA") && !cpu.socket.includes("PGA") && cpu.socket.indexOf(noMobileSockets[socket]) > -1) return false;
        }
        //if (!intelRegex.test(cpu.CPU) || !mobileCPU.includes(cpu.CPU.match(intelRegex)[1])) return false;
        if (cpu.CPU.includes("Ryzen") && cpu.CPU.includes("G")) return false;
    }
    return true;
}

var layout = {
    xaxis: {
        //range: [0, 7500]
        range: [2007, 2020]
    },
    yaxis: {
        range: [0, 7500]
        //range: [2007, 2020]
    },
    title: 'Performance Per Clock',
    hovermode: 'closest'
};

Object.keys(dataz).forEach(idx => {
    let CPU = dataz[idx];
    if (filter(CPU)) {
        if (!options.colorByVendor) {
            source = data[CPU.samples.toString().length]
        } else {
            data['1'].name = "AMD";
            data['2'].name = "Intel";
            if (CPU.CPU.includes("AMD")) source = data['1'];
            //else if (CPU.CPU.includes("Intel") || CPU.CPU.includes("Celeron")) source = data['2']
            else source = data['2']
        }
        source.x.push(parseFloat(parseInt(CPU.launch.substr(0, 4)) + (parseFloat("0." + CPU.launch.substr(-1, 1)) * 2.5)));
        source.y.push(CPU.index);
        //source.x.push(CPU.score);
        source.text.push(CPU.CPU);
    }
    // Calculate regressions
    //let regress = layout.xaxis.range.map;
    //while (regress <= layout.xaxis.range[1]) {
    //    console.log(regress);
    //    avgIntel = data['1']['x']
    //        .map((point, id) => regress == data['1'].y[id])
    //        .reduce((a, b) => a + b, 0) / data['1']['x'].length;
    //    avgAMD = data['2']['x']
    //        .map((point, id) => regress == data['2'].y[id])
    //        .reduce((a, b) => a + b, 0) / data['2']['x'].length;
    //    data['intel']['x'].push(avgIntel);
    //    data['amd']['x'].push(avgAMD);
    //    data['intel']['y'].push(regress);
    //    data['amd']['y'].push(regress);
    //    data['intel']['text'].push(regress);
    //    data['amd']['text'].push(regress);
    //    regress += 0.05
    //}
})

Plotly.newPlot('myDiv', Object.keys(data).map(key => data[key]), layout);
Plotly.relayout('myDiv', {
    'xaxis.autorange': true,
    'yaxis.autorange': true
});