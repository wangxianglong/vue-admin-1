<template>
  <div class="dashboard">
    <div class="notice">
      <h1>公告</h1>
      <p>某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某某</p>
    </div>
    <div class="lists">
      <div class="list download">
        <span class="icon">
          <svg-icon icon-class="download" class="icon-svg" />
        </span>
        <span class="content">收支明细</span>
        <span class="description">点击下载</span>
      </div>
      <div class="list all-money">
        <span class="icon">
          <svg-icon icon-class="all" class="icon-svg" />
        </span>
        <count-to
          :start-val="0"
          :end-val="allMoney"
          :duration="2600"
          prefix="¥"
          decimals="2"
          class="content"
        />
        <span class="description">总金额</span>
      </div>
      <div class="list left-money">
        <span class="icon">
          <svg-icon icon-class="money" class="icon-svg" />
        </span>
        <count-to
          :start-val="0"
          :end-val="leftMoney"
          :duration="2600"
          prefix="¥"
          decimals="2"
          class="content"
        />
        <span class="description">可用余额</span>
      </div>
    </div>
    <div id="chat"></div>
  </div>
</template>

<script>
import echarts from "echarts";
// 引入柱状图
require("echarts/lib/chart/bar");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
import CountTo from "vue-count-to";

export default {
  name: "Dashboard",
  data() {
    return {
      allMoney: 18000000.9087,
      leftMoney: 8000000,
      chart: null
    };
  },
  components: { CountTo },
  mounted() {
    this.initCharts();
    console.log(this.chart);
  },
  methods: {
    initCharts() {
      this.chart = echarts.init(document.getElementById("chat"), "bar");
      this.setOptions();
    },
    setOptions() {
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "line" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["收入", "支出"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月"
          ]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "收入",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: [320, 302, 301, 334, 390, 330, 320, 301, 334, 390, 330, 320]
          },
          {
            name: "支出",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: [-120, 132, 101, 134, 90, 230, 210, 101, 134, 90, 230, 210]
          }
        ]
      });
    }
  }
};
</script>

<style lang="scss" scoped>
$blue: #4d7cfe;
$lightblue: #e5ecff;
$orange: #ffab2b;
$lightorange: #fff3e0;
$green: #6dd230;
$lightgreen: #eaf8e1;
.dashboard {
  background-color: #f9f9f9;
  overflow: hidden;
  .notice {
    width: 1619px;
    height: 132px;
    background: #ffffff;
    padding-top: 10px;
    padding-left: 30px;
    margin: 30px 0;
  }
  .lists {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 30px;
    .list {
      width: 400px;
      height: 130px;
      background: #ffffff;
      position: relative;

      .icon::before {
        content: "";
        display: block;
        width: 66px;
        height: 66px;
        border-radius: 50%;
        z-index: 99;
        position: relative;
        top: -8px;
        left: -8px;
      }

      .icon {
        display: inline-block;
        width: 50px;
        height: 50px;
        background: $blue;
        border-radius: 25px;
        text-align: center;
        position: relative;
        top: 43px;
        left: 29px;
        z-index: 999;
        animation: all 0.1s linear;

        .icon-svg {
          height: 24px;
          width: 24px;
          position: relative;
          bottom: 52px;
          z-index: 9999;
          fill: #fff;
        }
      }
      .content {
        position: absolute;
        left: 104px;
        bottom: 55px;
        font-size: 26px;
        color: #252631;
      }
      .description {
        position: absolute;
        left: 104px;
        bottom: 37px;
        font-size: 14px;
        color: #98a9bc;
      }
    }
    .download {
      .icon {
        cursor: pointer;
        &::before {
          border: 8px solid $lightblue;
        }
        &:hover {
          background: $lightblue;
          .icon-svg {
            fill: $blue;
          }
          &::before {
            border: 8px solid $blue;
          }
        }
      }
    }
    .all-money {
      .icon {
        background: $orange;
        &::before {
          border: 8px solid $lightorange;
        }
        &:hover {
          background: $lightorange;
          .icon-svg {
            fill: $orange;
          }
          &::before {
            border: 8px solid $orange;
          }
        }
      }
    }
    .left-money {
      .icon {
        background: $green;
        &::before {
          border: 8px solid $lightgreen;
        }
        &:hover {
          background: $lightgreen;
          .icon-svg {
            fill: $green;
          }
          &::before {
            border: 8px solid $green;
          }
        }
      }
    }
  }
  #chat {
    width: 100%;
    height: 647px;
  }
}
</style>
