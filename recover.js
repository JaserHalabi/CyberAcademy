const fs = require('fs');
const readline = require('readline');
const path = require('path');

const transcriptPath = 'C:\\Users\\halab\\.gemini\\antigravity\\brain\\969011b7-2795-437f-a6b5-1b11d1f4f30d\\.system_generated\\logs\\transcript_full.jsonl';

async function recover() {
    const fileStream = fs.createReadStream(transcriptPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const fileStates = {};

    for await (const line of rl) {
        if (!line.trim()) continue;
        const step = JSON.parse(line);
        if (step.tool_calls) {
            for (const call of step.tool_calls) {
                if (call.name === 'default_api:write_to_file') {
                    if (call.arguments.TargetFile && call.arguments.CodeContent) {
                         const file = call.arguments.TargetFile;
                         if (!fileStates[file]) fileStates[file] = [];
                         fileStates[file].push({ type: 'write', content: call.arguments.CodeContent });
                    }
                } else if (call.name === 'default_api:replace_file_content') {
                     if (call.arguments.TargetFile && call.arguments.ReplacementContent && call.arguments.TargetContent) {
                         const file = call.arguments.TargetFile;
                         if (!fileStates[file]) fileStates[file] = [];
                         fileStates[file].push({ 
                             type: 'replace', 
                             target: call.arguments.TargetContent, 
                             replacement: call.arguments.ReplacementContent 
                         });
                     }
                } else if (call.name === 'default_api:multi_replace_file_content') {
                     if (call.arguments.TargetFile && call.arguments.ReplacementChunks) {
                         const file = call.arguments.TargetFile;
                         if (!fileStates[file]) fileStates[file] = [];
                         fileStates[file].push({ 
                             type: 'multi_replace', 
                             chunks: call.arguments.ReplacementChunks 
                         });
                     }
                }
            }
        }
    }
    
    // Dump all final states for inspection
    fs.writeFileSync('recover_dump.json', JSON.stringify(fileStates, null, 2));
    console.log('Recovery dump created.');
}

recover().catch(console.error);