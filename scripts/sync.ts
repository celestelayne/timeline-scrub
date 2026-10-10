// npm run sync: fetch the sheet's CSV, validate it, and write src/data/events.json.
// Override the source with SHEET_CSV_URL (for example a "Publish to web" CSV link).
import { writeFileSync } from 'node:fs'
import { groupMarkers } from '../src/model/markers.ts'
import { parseSheet } from './sheet.ts'

const DEFAULT_URL =
  'https://docs.google.com/spreadsheets/d/10YfyBBxcPbu_aooYppz8EPRnnddNDyzbFVKagBhn80U/export?format=csv'
const OUT_FILE = new URL('../src/data/events.json', import.meta.url)

function fail(message: string): never {
  console.error(message)
  process.exit(1)
}

const url = process.env.SHEET_CSV_URL ?? DEFAULT_URL
const response = await fetch(url).catch((error: unknown) => fail(`Could not reach the sheet: ${String(error)}`))
if (!response.ok) fail(`The sheet returned HTTP ${response.status}. Is link sharing on?`)
if (response.headers.get('content-type')?.includes('text/html')) {
  fail('The sheet returned a web page, not CSV. Set sharing to "Anyone with the link can view", or publish it to the web as CSV.')
}

const { events, errors, warnings } = parseSheet(await response.text())

for (const warning of warnings) console.warn(`warning: ${warning}`)
if (errors.length > 0) {
  for (const error of errors) console.error(`error: ${error}`)
  fail(`\nNot written: ${errors.length} error${errors.length === 1 ? '' : 's'} in the sheet. Fix them and run again.`)
}

writeFileSync(OUT_FILE, JSON.stringify(events, null, 2) + '\n')
const markers = groupMarkers(events)
console.log(`Wrote ${events.length} events in ${markers.length} markers to src/data/events.json (${warnings.length} warnings)`)
