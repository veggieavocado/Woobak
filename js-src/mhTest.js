const helloWord = 'hi hi';
const helloMH = 'mh';

console.log(`${helloWord} ${helloMH}`);

document.addEventListener('click', (e) => {
  if (e.target.id === 'hello-txt') {
    e.target.innerText = 'bye';
  }
});
