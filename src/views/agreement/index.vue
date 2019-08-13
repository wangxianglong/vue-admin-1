<template>
  <div id="app-container">
    <div class="filter-content">
      <el-input
        v-model.trim="mobileValue"
        placeholder="按手机号搜索"
        style="width: 200px;"
        @keyup.enter.native="handleSearch(1)"
      />
      <el-input
        v-model.trim="jobNumberValue"
        placeholder="按工号搜索"
        style="width: 200px;"
        @keyup.enter.native="handleSearch(1)"
      />
      <el-input
        v-model.trim="fullNameValue"
        placeholder="按姓名搜索"
        style="width: 200px;"
        @keyup.enter.native="handleSearch(1)"
      />
      <el-button type="primary" @click.native="handleSearch(1)">搜索</el-button>
      <el-button type="primary" @click.native="resetFilter">重置</el-button>
      <div class="buttons">
        <el-button type="primary">批量生成合同链接</el-button>
        <el-button type="warning">批量下载合同</el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      ref="rosterTable"
      style="width: 100%"
      v-loading="loading"
      :header-cell-style="{background:'#E1E1E1'}"
    >
      <el-table-column prop="fullName" label="姓名"></el-table-column>
      <el-table-column prop="mobile" label="手机号码"></el-table-column>
      <el-table-column prop="idCard" label="身份证号码"></el-table-column>
      <el-table-column prop="date" label="合同签订时间"></el-table-column>
      <el-table-column prop="registerStatus" label="签约状态">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            v-show="scope.row.registerStatus=='0'"
          >已签约</el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-error"
            v-show="scope.row.registerStatus=='1'"
          >未签约</el-button>
        </template>
      </el-table-column>
      <el-table-column width="280" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="checkUserData(scope.row,scope.$index)"
            size="mini"
            type="text"
          >生成合同链接</el-button>
          <el-button
            @click.native.prevent="editUserData(scope.row,scope.$index)"
            size="mini"
            type="text"
          >下载合同</el-button>
          <el-button
            @click.native.prevent="deleteUserData(scope.$index,tableData)"
            size="mini"
            type="text"
            style="color:red"
          >删除合同</el-button>
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
export default {
  data() {
    return {
      tableData: [], //表格数据
      total: -1, //总数据量
      currentPage: 1, //分页当前页数
      loading: false, //加载数据时显示动效
      pageSize: 10, //一页数据量
      pageNum: 1, //第几页
      customerId: 3,

      editRowIndex: -1, //表格编辑行索引
      //查询数据
      mobileValue: "",
      jobNumberValue: "",
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
      this.loading = true;
      this.$axios
        .get(url.rosterLists, {
          params: {
            customerId: this.customerId,
            pageSize: this.pageSize,
            pageNum: this.pageNum
          }
        })
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            if (res.data.result === 1) {
              if (res.data.data.list.length <= 0 && this.pageNum > 1) {
                this.pageNum--;
                this.getDataLists();
              } else {
                this.tableData = res.data.data.list;
                this.total = res.data.data.total;
              }
            } else {
              this.$message.error(res.data.msg);
            }
          } else {
            this.$message.error("获取数据出错！");
          }
          this.loading = false;
        })
        .catch(error => {
          this.$message.error("获取数据出错！");
          this.loading = false;
        });
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
    height: 100px;
    padding: 30px;
    .buttons {
      float: right;
      margin-right: 30px;
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
}
</style>


