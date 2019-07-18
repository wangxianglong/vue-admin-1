<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="grid-content">
          <div class="allMoney money  bg-purple">
            <div class="content-header">全部金额</div>
            <div class="content-content">12345667</div>
          </div>
          <div class="availableMoney money bg-purple">
            <div class="content-header">可用金额</div>
            <div class="content-content">12345667</div>
          </div>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple">
            <div class="content-header">折线图</div>
            <div class="content-content liner">12345667</div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="10">  
        <div class="grid-content bg-purple">
            <div class="content-header">饼图</div>
            <div class="content-content pie">12345667</div>
        </div>
      </el-col>
      <el-col :span="14">
          <div class="grid-content bg-purple">
            <div class="content-header">柱形图图</div>
            <div class="content-content bar">12345667</div>
          </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import echarts from 'echarts'
// 引入柱状图
require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
      return {
        chart: null
      }
  },
  mounted() {
      this.initCharts()
  },
  methods: {
      initCharts() {
        this.lineChart = echarts.init(document.getElementsByClassName('liner')[0]);
        this.pieChart = echarts.init(document.getElementsByClassName('pie')[0]);
        this.barChart = echarts.init(document.getElementsByClassName('bar')[0]);
        this.setOptions();
      },
      setOptions() {
        this.lineChart.setOption({
          title: {
              text: '折线图堆叠'
          },
          tooltip: {
              trigger: 'axis'
          },
          legend: {
              data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          toolbox: {
              feature: {
                  saveAsImage: {}
              }
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: ['周一','周二','周三','周四','周五','周六','周日']
          },
          yAxis: {
              type: 'value'
          },
          series: [
              {
                  name:'邮件营销',
                  type:'line',
                  stack: '总量',
                  data:[120, 132, 101, 134, 90, 230, 210]
              },
              {
                  name:'联盟广告',
                  type:'line',
                  stack: '总量',
                  data:[220, 182, 191, 234, 290, 330, 310]
              },
              {
                  name:'视频广告',
                  type:'line',
                  stack: '总量',
                  data:[150, 232, 201, 154, 190, 330, 410]
              },
              {
                  name:'直接访问',
                  type:'line',
                  stack: '总量',
                  data:[320, 332, 301, 334, 390, 330, 320]
              },
              {
                  name:'搜索引擎',
                  type:'line',
                  stack: '总量',
                  data:[820, 932, 901, 934, 1290, 1330, 1320]
              }
          ]
        });
        this.pieChart.setOption({
          tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
              orient: 'vertical',
              x: 'left',
              data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
          },
          series: [
              {
                  name:'访问来源',
                  type:'pie',
                  radius: ['50%', '70%'],
                  avoidLabelOverlap: false,
                  label: {
                      normal: {
                          show: false,
                          position: 'center'
                      },
                      emphasis: {
                          show: true,
                          textStyle: {
                              fontSize: '30',
                              fontWeight: 'bold'
                          }
                      }
                  },
                  labelLine: {
                      normal: {
                          show: false
                      }
                  },
                  data:[
                      {value:335, name:'直接访问'},
                      {value:310, name:'邮件营销'},
                      {value:234, name:'联盟广告'},
                      {value:135, name:'视频广告'},
                      {value:1548, name:'搜索引擎'}
                  ]
              }
          ]
        });
        this.barChart.setOption({
          xAxis: {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
              type: 'value'
          },
          series: [{
              data: [120, 200, 150, 80, 70, 110, 130],
              type: 'bar'
          }]
      })
      }
  }
}
</script>

<style lang="scss" scoped>

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  height: 360px;
}
.money{
  height:170px;
}
.allMoney{
  margin-bottom: 20px;
}
.content-header{
  width:100%;
  height:35px;
  border-left: 4px solid red;
  padding-left: 15px;
  display:flex;
  align-items: center;  
}
.money .content-content{
  display:flex;
  align-items: center;  
  justify-content: center;
  font-size:50px;
  color:cornflowerblue;
}
.content-content{
  height:calc(90%);
  width: 100%;
}
</style>
