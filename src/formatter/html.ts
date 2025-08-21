/* eslint-disable @typescript-eslint/no-unused-vars */
import Formatter from "."
import fs from "fs"
import escapeHTML from "escape-html"
import DiffAOA from "../DiffAOA"
import path from "path"

export class HTML extends Formatter<string> {
    constructor(
        patcher = (actual: string | null, expected: string | null) => {
            let patchedString = ""
            if (actual)
                patchedString += `<span style="background:#ffbbbb;"><s>${actual}</s></span>`
            if (actual && expected)
                patchedString += " "
            if (expected)
                patchedString += `<span style="background:#bbffbb;">${expected}</span>`
            return patchedString
        }
    ) {
        super(patcher)
        this.patch = patcher
    }
    format(diffAOA: DiffAOA<string>): string {
        const script = fs.readFileSync(path.resolve(__dirname, "./script.js"), "utf8");
        const patchedAOA = diffAOA.map((row) => {
            return row.map((cell) => {
                if (Array.isArray(cell)) {
                    return this.patch(cell[0], cell[1])
                }
                return cell;
            });
        })
        return `
        <div id="spread-diff-patch">
            <style>
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            </style>
            <div id="spread-diff-patch-data" data-raw-diffAOA='${escapeHTML(JSON.stringify(patchedAOA))}'></div>
            <script src="https://cdn.jsdelivr.net/npm/ag-grid-community@34.1.2/dist/ag-grid-community.min.js"></script>
            <script>
                ${script}
            </script>
        </div>
        `
    }
}