<template>
  <div id="app-container">
    <div class="filter-content">
      <el-input
        v-model.trim="mobileValue"
        placeholder="按批次号搜索"
        style="width: 200px;"
        @keyup.enter.native="handleSearch(1)"
      />
      <el-date-picker v-model="monthValue" type="month" placeholder="按上传月份搜索"></el-date-picker>
      <el-input
        v-model.trim="fullNameValue"
        placeholder="按姓名搜索"
        style="width: 200px;"
        @keyup.enter.native="handleSearch(1)"
      />
      <el-button type="primary" @click.native="handleSearch(1)">搜索</el-button>
      <el-button type="primary" @click.native="resetFilter">重置</el-button>
    </div>
    <el-table
      :data="tableData"
      ref="rosterTable"
      style="width: 100%"
      v-loading="loading"
      @filter-change="filterStatus"
      :header-cell-style="{background:'#E1E1E1'}"
    >
      <el-table-column type="selection" width="55" fixed></el-table-column>
      <el-table-column prop="jobNumber" label="工号"></el-table-column>
      <el-table-column prop="fullName" label="姓名"></el-table-column>
      <el-table-column prop="sex" label="性别"></el-table-column>
      <el-table-column prop="bankName" label="开户行" width="100"></el-table-column>
      <el-table-column prop="registerStatus" label="注册状态" width="150">
        <template slot-scope="scope">
          <span v-show="scope.row.registerStatus=='1'" class="table-status">
            <span class="status-icon" style="background-color:#E1E1E1"></span>已撤销
          </span>
          <span v-show="scope.row.registerStatus=='2'" class="table-status">
            <span class="status-icon" style="background-color:orange"></span>待复核
          </span>
          <span v-show="scope.row.registerStatus=='3'" class="table-status">
            <span class="status-icon" style="background-color:lightblue"></span>已复核待支付
          </span>
          <span v-show="scope.row.registerStatus=='4'" class="table-status">
            <span class="status-icon" style="background-color:red"></span>被驳回
          </span>
          <span v-show="scope.row.registerStatus=='5'" class="table-status">
            <span class="status-icon" style="background-color:blue"></span>支付中
          </span>
          <span v-show="scope.row.registerStatus=='6'" class="table-status">
            <span class="status-icon" style="background-color:green"></span>支付完成
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="typeOfWork"
        label="工种"
        :filters="[{ text: '财务', value: '财务' }, { text: '出纳', value: '出纳' }, { text: '经理', value: '经理' }]"
        column-key="typeOfWork"
        filter-placement="bottom-end"
      ></el-table-column>
      <el-table-column width="200" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            v-show="scope.row.registerStatus=='2'"
            @click.native="check(scope.row.registerStatus,scope.$index)"
          >复核</el-button>
          <el-button size="mini" type="primary" v-show="scope.row.registerStatus=='4'">查看驳回原因</el-button>
          <el-button size="mini" type="primary" v-show="scope.row.registerStatus=='6'">下载支付失败记录</el-button>
          <el-button size="mini" type="primary" v-show="scope.row.registerStatus=='6'">下载支付详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        layout="sizes, prev, pager, next"
        @size-change="handleSizeChange"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        :current-page.sync="currentPage"
        @current-change="paginationChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import url from "@/api/api.js";
import { validatePhone, validateId } from "@/utils/validate";
export default {
  data() {
    return {
      tableData: [
        {
          registerStatus: 1
        },
        {
          registerStatus: 2
        },
        {
          registerStatus: 3
        },
        {
          registerStatus: 4
        },
        {
          registerStatus: 5
        },
        {
          registerStatus: 6
        }
      ], //表格数据
      total: 21, //总数据量
      currentPage: 1, //分页当前页数
      loading: false, //加载数据时显示动效
      pageSize: 10, //一页数据量
      pageNum: 1, //第几页
      customerId: 1,
      //查询数据
      mobileValue: "",
      monthValue: "",
      fullNameValue: "",
      //过滤数据
      filterDatas: {
        registerStatus: [],
        state: [],
        typeOfWork: []
      }
    };
  },
  mounted() {
    if (this.$route.query.pageNum) {
      this.pageNum = this.$route.query.pageNum;
    }
    console.log(this.$route.query.pageNum);
    if (this.$route.query.pageNum) {
      this.pageSize = this.$route.query.pageSize;
      this.currentPage = parseInt(this.pageSize);
    }
    this.getDataLists();
  },
  methods: {
    //根据手机号，真实姓名，工号模糊查询
    handleSearch(pageNum) {
      this.$axios
        .get(url.rosterSearch, {
          params: {
            customerId: this.customerId,
            mobile: this.mobileValue,
            jobNumber: this.jobNumberValue,
            fullName: this.fullNameValue,
            pageNum: pageNum,
            pageSize: this.pageSize
          }
        })
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            if (res.data.result === 1) {
              this.filterType = "search";
              if (pageNum === 1) {
                this.pageNum = 1;
                this.currentPage = 1;
              }
              this.tableData = res.data.data.list;
              this.total = res.data.data.total;
              this.$message.success("查询成功");
            } else {
              this.$message.error(res.data.msg);
            }
          } else {
            this.$message.error("查询失败");
          }
        });
    },
    //根据承揽人注册状态、工种、状态过滤分组查询
    handleFilter(pageNum) {
      this.$axios
        .post(url.rosterFilter, {
          customerId: this.customerId,
          registerStatusS: JSON.parse(
            JSON.stringify(this.filterDatas.registerStatus)
          ),
          statusS: JSON.parse(JSON.stringify(this.filterDatas.state)),
          typeOfWorkS: JSON.parse(JSON.stringify(this.filterDatas.typeOfWork)),
          pageSize: this.pageSize,
          pageNum: pageNum
        })
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            if (res.data.result === 1) {
              this.filterType = "filter";
              if (pageNum === 1) {
                this.pageNum = 1;
                this.currentPage = 1;
              }
              this.tableData = res.data.data.list;
              this.total = res.data.data.total;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //重置
    resetFilter() {
      this.pageNum = 1;
      this.currentPage = 1;
      this.getDataLists();
      (this.mobileValue = ""),
        (this.jobNumberValue = ""),
        (this.fullNameValue = "");
      this.filterType = "";
    },
    //获取过滤数据
    filterStatus(filters) {
      for (var key in filters) {
        this.filterDatas[key] = filters[key];
      }
      this.handleFilter(1);
    },
    //获取数据列表
    getDataLists() {
      // this.loading = true;
      this.$router.replace({
        path: "/afterTax/",
        query: { pageNum: this.pageNum, pageSize: this.pageSize }
      });
      // this.$axios
      //   .get(url.rosterLists, {
      //     params: {
      //       customerId: this.customerId,
      //       pageSize: this.pageSize,
      //       pageNum: this.pageNum
      //     }
      //   })
      //   .then(res => {
      //     console.log(res);
      //     if (res.status === 200) {
      //       if (res.data.result === 1) {
      //         if (res.data.data.list.length <= 0 && this.pageNum > 1) {
      //           this.pageNum--;
      //           this.getDataLists();
      //         } else {
      //           this.tableData = res.data.data.list;
      //           this.total = res.data.data.total;
      //         }
      //       } else {
      //         this.$message.error(res.data.msg);
      //       }
      //     } else {
      //       this.$message.error("获取数据出错！");
      //     }
      //     this.loading = false;
      //   })
      //   .catch(error => {
      //     this.$message.error("获取数据出错！");
      //     this.loading = false;
      //   });
    },
    //改变页数
    paginationChange(currentPage) {
      this.pageNum = currentPage;
      if (this.filterType === "search") {
        this.handleSearch(this.pageNum);
      } else {
        if (this.filterType === "filter") {
          this.handleFilter(this.pageNum);
        } else {
          this.getDataLists();
        }
      }
    },
    //改变每页数据量
    handleSizeChange(size) {
      this.pageSize = size;
      this.pageNum = 1;
      this.currentPage = 1;
      if (this.filterType === "search") {
        this.handleSearch(this.pageNum);
      } else {
        if (this.filterType === "filter") {
          this.handleFilter(this.pageNum);
        } else {
          this.getDataLists();
        }
      }
    },
    check(data, index) {
      data = 1;
      this.$router.push({
        path: "/afterTax/check/" + data,
        query: { pageNum: this.pageNum, pageSize: this.pageSize }
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

#app-container {
  background: #f9f9f9;

  .filter-content {
    box-sizing: border-box;
    height: 60px;
    padding-top: 20px;
    margin-bottom: 20px;
    margin-left: 30px;
  }
  .table-status {
    display: inline-block;
    height: 20px;
    line-height: 20px;
    .status-icon {
      display: inline-block;
      height: 16px;
      width: 16px;
      border-radius: 8px;
      vertical-align: top;
      margin-right: 5px;
    }
  }

  .pagination {
    margin-top: 20px;
  }

  .el-button + .el-button {
    margin-left: 0;
  }

  /deep/.el-pager li {
    border: 1px solid #a9a9a9;
    border-radius: 3px;
    margin: 0 5px;
  }

  /deep/.el-pager li.active {
    background: #0091ff;
    color: #ffffff;
    border: 1px solid #0091ff;
  }
  /deep/.el-upload-list {
    display: none;
  }
}
</style>


