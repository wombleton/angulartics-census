# angulartics-census
Generates a CSV containing a list of analytics-on attributes in html files under the source directory.

The columns in the CSV are:

 * `analytics-category`
 * `analytics-event`
 * Tag name of the element
 * File name of the attribute

You can add an extra attribute to check with a Y/N response by passing `--attr-check="analytics-if"` in.

## Usage

```bash
npm i angulartics-census
node_modules/angulartics-census/census -p src --attr-check="analytics-event"
```
