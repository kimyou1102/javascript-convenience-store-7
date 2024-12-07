import Controller from './controller/Controller.js';

class App {
  async run() {
    const controller = new Controller();
    controller.start();
  }
}

export default App;
