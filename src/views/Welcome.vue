<template>
  <div>
    <p>
      <img src="static/images/sun.png" alt align="center" />
      {{user.account}}早上好，欢迎使用信息管理系统
    </p>
    <p>
      <img src="static/images/time.png" alt align="center" />
      您登录的时间：{{now}}
    </p>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      now: new Date().toLocaleString()
    };
  },
  //   filters: {
  //     date(date) {
  //       let times = "";
  //       let year = date.getFullYear();
  //       let month = date.getMonth() + 1;
  //       let day = date.getDate();
  //       let hour = date.getHours();
  //       let minute = date.getMinutes();
  //       let second = date.getSeconds();
  //       month = month < 10 ? "0" + month : month;
  //       day = day < 10 ? "0" + day : day;
  //       hour = hour < 10 ? "0" + hour : hour;
  //       minute = minute < 10 ? "0" + minute : minute;
  //       second = second < 10 ? "0" + second : second;
  //       if (hour >= 6 && hour < 11) {
  //         times = "上午";
  //       }
  //       if (hour >= 11 && hour < 13) {
  //         times = "中午";
  //       }
  //       if (hour >= 13 && hour < 18) {
  //         times = "下午";
  //       }
  //       if (hour >= 18 && hour <= 24) {
  //         times = "晚上";
  //       }
  //       if (hour > 0 && hour < 6) {
  //         times = "晚上";
  //       }
  //       return `${year}/${month}/${day} ${times}${hour}:${minute}:${second} `;
  //     }
  //   },

  computed: {
    ...mapState(["user"])
  },
  created() {
    console.log("登录的用户信息：", this.user);
  },
  mounted() {
    let _this = this;
    this.timer = setInterval(() => {
      _this.now = new Date().toLocaleString();
    }, 1000);
  }
};
</script>

<style scoped>
p {
  font-size: 12px;
}

</style>