class Block {
    constructor(name, time) {
        this.name = name;
        this.time = time;
    }
}
/**
 * WIP!
 * Usage:
 * function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
      }

      const p = new Profiler(500);
      p.addTimePoint("start");
      
      sleep(250).then(() => {
        p.addTimePoint("middle");

        sleep(251).then(() => {
          p.addTimePoint("end");
          console.log(p.summTime);
        });
      });
 */
export default class Profiler {
    constructor(limit, logFn) {
        this.limit = limit;
        this.blocks = [];
        this.logFn = logFn || function (summary) {
            console.log(summary);
        };
        this.summTime = 0;
    }

    flush() {
        this.blocks = [];
        this.summTime = 0;
    }

    addTimePoint(blockName) {
        const newBlock = new Block(blockName, new Date().getTime());

        this.blocks.push(newBlock);

        if (this.blocks.length > 1) {
            this.summTime += newBlock.time - this.blocks[this.blocks.length - 2].time;
        }

        if (this.summTime >= this.limit) {
            var summary = "";

            for (var i = 0; i < this.blocks.length; i++) {
                if (this.blocks[i + 1]) {
                    summary += this.blocks[i].name;
                    summary += " > ";
                    summary += this.blocks[i + 1].name + " took : ";
                    summary += (this.blocks[i + 1].time - this.blocks[i].time) + "ms; ";
                }
            }

            this.logFn(summary);
            this.flush();
        }
    }
}