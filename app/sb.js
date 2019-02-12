import shell from 'shelljs'

shell.echo('🏗   SNADBOX RUN')

const waitFor = (ms, num) =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log('timeouted', ms, num)
      return resolve(ms + num)

    }, ms);
  });

let results = [];
let result;
const run = async () => {
  results = [1, 2, 3].map(num => waitFor(50, num));
  result = await Promise.all(results)
}

run().then(() => {
  console.log("Done");
  console.log("results", results);
  console.log("result", result);

  shell.echo('✅   RUN FINISHED')
})


