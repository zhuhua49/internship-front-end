export const captchaMixin = {
  data() {
    return {
      captcha: ""
    }
  },
  mounted() {
    this.drawPic()
  },
  methods: {
    /**生成一个随机数**/
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    /**生成一个随机色**/
    randomColor(min, max) {
      let r = this.randomNum(min, max);
      let g = this.randomNum(min, max);
      let b = this.randomNum(min, max);
      return "rgb(" + r + "," + g + "," + b + ")";
    },
    /**绘制验证码图片**/
    drawPic() {
      let canvas = this.$refs.changeImg;
      let width = canvas.width;
      let height = canvas.height;
      let ctx = canvas.getContext('2d');
      ctx.textBaseline = 'bottom';

      /**绘制背景色**/
      ctx.fillStyle = this.randomColor(180, 240); //颜色若太深可能导致看不清
      ctx.fillRect(0, 0, width, height);
      /**绘制文字**/
      let str = 'ABCEFGHJKLMNPQRSTWXY123456789';
      this.captcha = "";
      for (let i = 0; i < 4; i++) {
        let txt = str[this.randomNum(0, str.length)];
        this.captcha += txt;
        ctx.fillStyle = this.randomColor(50, 60);  //随机生成字体颜色
        ctx.font = this.randomNum(20, 40) + 'px SimHei'; //随机生成字体大小
        let x = 10 + i * 25;
        let y = this.randomNum(25, 45);
        let deg = this.randomNum(-45, 45);
        //修改坐标原点和旋转角度
        ctx.translate(x, y);
        ctx.rotate(deg * Math.PI / 180);
        ctx.fillText(txt, 0, 0);
        //恢复坐标原点和旋转角度
        ctx.rotate(-deg * Math.PI / 180);
        ctx.translate(-x, -y);
      }
      /**绘制干扰线**/
      for (let i = 0; i < 8; i++) {
        ctx.strokeStyle = this.randomColor(70, 180);
        ctx.beginPath();
        ctx.moveTo(this.randomNum(0, width), this.randomNum(0, height));
        ctx.lineTo(this.randomNum(0, width), this.randomNum(0, height));
        ctx.stroke();
      }
      /**绘制干扰点**/
      for (let i = 0; i < 100; i++) {
        ctx.fillStyle = this.randomColor(0, 255);
        ctx.beginPath();
        ctx.arc(this.randomNum(0, width), this.randomNum(0, height), 1, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  },
};
