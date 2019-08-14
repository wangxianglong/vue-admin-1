<template>
  <div id="app-container">
    <div class="add-content">
      <div class="load download">
        <span class="icon">
          <svg-icon icon-class="download" class="icon-svg" />
        </span>
        <div class="download-content">
          <el-radio v-model="uploadType" label="1" class="upload-radio">下载批量付款常规模板</el-radio>
          <el-radio v-model="uploadType" label="2" class="upload-radio">下载花名册生成支付模板</el-radio>
        </div>
      </div>
      <div class="load upload">
        <el-upload
          class="upload-demo"
          action="doUpload"
          :before-upload="beforeUpload"
          multiple
          :limit="1"
          :on-exceed="handleExceed"
          accept="xls"
          ref="newupload"
          :auto-upload="false"
        >
          <span class="icon">
            <svg-icon icon-class="upload" class="icon-svg" />
          </span>
        </el-upload>
        <span class="text">上传excel</span>
        <el-button size="middle" type="primary" @click="newSubmitForm" class="upload-button">导入</el-button>
      </div>
    </div>
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
      <el-table-column prop="mobile" label="手机号码" width="140"></el-table-column>
      <el-table-column prop="idType" label="证件类型"></el-table-column>
      <el-table-column prop="idCard" label="身份证号码" width="150"></el-table-column>
      <el-table-column prop="bankAccount" label="银行卡号" width="150"></el-table-column>
      <el-table-column prop="bankName" label="开户行" width="100"></el-table-column>
      <el-table-column
        prop="registerStatus"
        label="注册状态"
        width="120"
        column-key="registerStatus"
        :filters="[{ text: '待注册', value: '0' }, { text: '注册失败', value: '2' }, { text: '注册成功', value: '1' }]"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="info"
            icon="el-icon-warning"
            v-show="scope.row.registerStatus=='0'"
          >待注册</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-error"
            v-show="scope.row.registerStatus=='2'"
          >注册失败</el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-success"
            v-show="scope.row.registerStatus=='1'"
          >注册成功</el-button>
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
            @click.native.prevent="checkUserData(scope.row,scope.$index)"
            size="mini"
            type="primary"
          >下载支付明细表</el-button>
          <el-button
            @click.native.prevent="editUserData(scope.row,scope.$index)"
            size="mini"
            type="primary"
          >下载上传失败记录</el-button>
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
      tableData: [], //表格数据
      total: -1, //总数据量
      currentPage: 1, //分页当前页数
      loading: false, //加载数据时显示动效
      pageSize: 10, //一页数据量
      pageNum: 1, //第几页
      customerId: 1,
      uploadType: "1", //上传类型
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
    // this.getDataLists();
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
    },
    //上传文件
    beforeUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "xls";
      const extension2 = testmsg === "xlsx";
      const xlsName = file.name.substring(0, file.name.lastIndexOf("."));
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!extension && !extension2) {
        this.$message({
          message: "上传文件只能是 xls、xlsx格式!",
          type: "warning"
        });
        return false;
      }
      if (xlsName.length > 100) {
        this.$message({
          message: "上传文件名不能超过100个字!",
          type: "warning"
        });
        return false;
      }
      if (!isLt5M) {
        this.$message({
          message: "上传文件大小不能超过 5MB!",
          type: "warning"
        });
        return false;
      }
      let fd = new FormData();
      fd.append("file", file); //传文件
      fd.append("customerId", this.customerId);
      fd.append("importId", this.uploadType);
      this.$axios.post(url.rosterImportExcel, fd).then(res => {
        if (res.status === 200) {
          if (res.data.result === 1) {
            this.getDataLists();
            this.$message.success("上传成功");
          } else {
            this.$message.error(res.data.msg);
          }
        } else {
          this.$message.error("上传失败");
        }
      });
    },
    //文件个数限制
    handleExceed(files, fileList) {
      this.$message.warning("一次只能上传一个文件");
    },
    //确定上传
    newSubmitForm() {
      this.$refs.newupload.submit();
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

  .add-content {
    height: 140px;
    padding: 30px;
    display: flex;

    .load {
      width: 400px;
      height: 80px;
      font-family: "微软雅黑";
      color: #252631;
      font-size: 16px;
      position: relative;
      background: #ffffff;
      text-align: center;
      animation: all 0.1s liner;

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
        position: absolute;
        top: 15px;
        left: 28px;
        z-index: 999;

        .icon-svg {
          height: 24px;
          width: 24px;
          position: relative;
          bottom: 52px;
          z-index: 9999;
          fill: #fff;
        }
      }

      .text {
        position: absolute;
        top: 29px;
        left: 104px;
      }
      &.download {
        width: 340px;

        .download-content {
          margin-left: 120px;
          width: 220px;
          height: 80px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          overflow: hidden;
          text-align: left;
        }
        .icon {
          cursor: pointer;
          &::before {
            border: 8px solid $lightblue;
          }
          &:hover {
            background: $lightblue;
            .icon-svg {
              fill: $blue !important;
            }
            &::before {
              border: 8px solid $blue;
            }
          }
        }
      }
      &.upload {
        margin-left: 20px;
        .upload-button {
          width: 87px;
          height: 40px;
          margin-left: 90px;
        }
        .icon {
          background: $orange;
          &::before {
            border: 8px solid $lightorange;
          }
          &:hover {
            background: $lightorange;
            .icon-svg {
              fill: $orange !important;
            }
            &::before {
              border: 8px solid $orange;
            }
          }
        }
      }
    }
  }

  .filter-content {
    height: 40px;
    margin-bottom: 20px;
    margin-left: 30px;
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


