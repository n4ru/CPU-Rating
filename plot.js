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
}

filter = (cpu) => {
    options = {
        "AMD": true,
        "Intel": true,
        "exactcores": true,
        "name": null,
        "cores": 4,
        "threads": 0,
        "samples": 1,
        "onlymobile": true,
        "overclockable": true
    }

    ocTable = ["K", "X", "HK", "XM"];
    ocCPU = ["G3258", "Athlon"];
    ocSocket = ["AM3+", "FM2+", "AM4"];
    mobileCPU = ["M", "U", "H", "HK", "XM", "G", "QE", "QM", "Y", "HQ", "ME", "UE", "LE"];

    if (cpu.CPU.includes("AMD") && !options.AMD) return false;
    if ((cpu.CPU.includes("Intel") || cpu.CPU.includes("Celeron")) && !options.Intel) return false;
    if (options.cores > 0 && ((!options.exactcores && cpu.cores < options.cores) || options.exactcores && cpu.cores !== options.cores)) return false;
    if (options.threads > 0 && cpu.threads < options.threads) return false;
    if (options.samples > 0 && cpu.samples < options.samples) return false;
    if (options.name && !cpu.CPU.includes(options.name)) return false;
    if (!options.overclockable) {
        for (chip in ocCPU) {
            if (cpu.CPU.includes(ocCPU[chip])) return false;
        }
        if (options.Intel && (/[0-9]{3,4}([A-Z]{1,2})/.test(cpu.CPU) && ocTable.includes(cpu.CPU.match(/[0-9]{3,4}([A-Z]{1,2})/)[1]))) return false;
        if (options.AMD && (ocSocket.includes(cpu.socket) || cpu.CPU.includes("Athlon"))) return false;
    }
    if (options.onlymobile) {
        if (!/[0-9]{3,4}([A-Z]{1,2})/.test(cpu.CPU) || !mobileCPU.includes(cpu.CPU.match(/[0-9]{3,4}([A-Z]{1,2})/)[1])) return false;
        if (/[0-9]{3,4}([A-Z]{1,2})/.test(cpu.CPU) && (cpu.CPU.includes("Ryzen") && cpu.CPU.includes("G"))) return false;
        if (/[0-9]{3,4}([A-Z]{1,2})/.test(cpu.CPU) && (cpu.CPU.includes("Ryzen") && cpu.CPU.includes("G"))) return false;
    }
    return true;
}

var layout = {
    yaxis: {
        range: [0, 7500]
        //range: [2007, 2020]
    },
    xaxis: {
        //range: [0, 7500]
        range: [2007, 2020]
    },
    title: 'Performance Per Clock',
    hovermode: 'closest'
};

Object.keys(dataz).forEach(idx => {
    let CPU = dataz[idx];
    if (filter(CPU)) {
        data[CPU.samples.toString().length].x.push(parseFloat(CPU.launch));
        data[CPU.samples.toString().length].y.push(CPU.index);
        //data[CPU.samples.toString().length].x.push(CPU.score);
        data[CPU.samples.toString().length].text.push(CPU.CPU);
    }
})

Plotly.newPlot('myDiv', Object.keys(data).map(key => data[key]), layout);
Plotly.relayout('myDiv', {
    'xaxis.autorange': true,
    'yaxis.autorange': true
});