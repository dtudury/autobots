"use strict";

const ts = require("typescript");

module.exports = config => new Promise((resolve, reject) => {
    try {
        let default_options = {
            "compilerOptions": {
                "jsx": "react",
                "reactNamespace": "h",
                "target": "es5",
                "sourceMap": true
            }
        }
        let options = JSON.parse(JSON.stringify(Object.assign({}, default_options, config.options || {})));
        //options.include = options.include || [config.src];
        options.compilerOptions.outFile = options.compilerOptions.outFile || config.dest;
        //console.log(options);

        console.log(ts.transpileModule(config.src, options).outputText)


        let program = ts.createProgram([config.src], options.compilerOptions);
        let emitResult = program.emit();

        let allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
        console.log(program);
        console.log(program.emit());

        allDiagnostics.forEach(diagnostic => {
            console.log(diagnostic);
            //console.log(diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start));
            /*
            let {
                line,
                character
            } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
            */
        });
        //console.log(emitResult);

        if (emitResult.emitSkipped) {
            reject(config);
        } else {
            resolve(config);
        }
    } catch (e) {
        console.log(e);
        reject(e);
    }
})

/*
/// <reference types="node" />

import * as ts from "typescript";

function compile(fileNames: string[], options: ts.CompilerOptions): void {
    let program = ts.createProgram(fileNames, options);
    let emitResult = program.emit();

    let allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

    allDiagnostics.forEach(diagnostic => {
        let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    });

    let exitCode = emitResult.emitSkipped ? 1 : 0;
    console.log(`Process exiting with code '${exitCode}'.`);
    process.exit(exitCode);
}

interface Config {
    src: string,
    dest: string
}

export default function (config: Config): Promise<Config> {
    return new Promise<Config>((resolve, reject) => {
        compile([config.src], {
            noEmitOnError: true,
            noImplicitAny: true,
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS
        });

    })
}
*/
