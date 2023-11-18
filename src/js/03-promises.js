import Notiflix from 'notiflix';

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;

    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}

document.querySelector('.form').addEventListener('submit', function (event) {
  event.preventDefault();
  
  const firstDelay = Number(this.elements.delay.value, 10);
  const step = Number(this.elements.step.value, 10);
  const amount = Number(this.elements.amount.value, 10);

  for (let i = 1; i <= amount; i++) {
    createPromise(i, firstDelay + step * (i - 1))
      .then(({ position, delay }) => {
        Notiflix.Notify.success(`Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notiflix.Notify.failure(`Rejected promise ${position} in ${delay}ms`);
      });
  }
});