<template>
  <div class="app-container">
    <template>
      <div class="add-container">
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
          <el-button size="small" type="primary">添加要上传的excel</el-button>
          <!-- <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且不超过500kb</div> -->
        </el-upload>
        <el-radio v-model="uploadType" label="1">增量导入</el-radio>
        <el-radio v-model="uploadType" label="2">覆盖导入</el-radio>
        <el-button size="small" type="primary" @click="newSubmitForm">导入</el-button>
      </div>
      <div class="filter-container">
        <el-input
          v-model.trim="mobileValue"
          placeholder="按手机号搜索"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleSearch(1)"
        />
        <el-input
          v-model.trim="jobNumberValue"
          placeholder="按工号搜索"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleSearch(1)"
        />
        <el-input
          v-model.trim="fullNameValue"
          placeholder="按姓名搜索"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleSearch(1)"
        />
        <el-button-group>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click.native="handleSearch(1)"
          >搜索</el-button>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-share"
            @click.native="resetFilter"
          >重置</el-button>
        </el-button-group>
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="danger"
          icon="el-icon-delete"
          @click="deleteUserDatas(tableData)"
        >删除选中</el-button>
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="danger"
          icon="el-icon-delete"
          @click="deleteUserDataAll"
        >全部删除</el-button>
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-add"
          @click="addUserData"
        >新增</el-button>
      </div>
      <el-table
        :data="tableData"
        ref="rosterTable"
        border
        @selection-change="handleSelectionChange"
        style="width: 100%"
        v-loading="loading"
        @filter-change="filterStatus"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="jobNumber" label="工号"></el-table-column>
        <el-table-column prop="fullName" label="姓名"></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column prop="mobile" label="手机号码"></el-table-column>
        <el-table-column prop="idType" label="证件类型"></el-table-column>
        <el-table-column prop="idCard" label="身份证号码"></el-table-column>
        <el-table-column prop="bankAccount" label="银行卡号"></el-table-column>
        <el-table-column prop="bankName" label="开户行"></el-table-column>
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
        <el-table-column
          prop="state"
          width="100"
          label="状态"
          :filters="[{ text: '禁用', value: 'forbidden' }, { text: '启用', value: 'success' }]"
          column-key="state"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="danger" v-show="scope.row.state=='forbidden'">禁用</el-button>
            <el-button size="mini" type="primary" v-show="scope.row.state=='success'">启用</el-button>
          </template>
        </el-table-column>
        <el-table-column width="180" label="操作">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="checkUserData(scope.row,scope.$index)"
              icon="el-icon-message"
              size="mini"
              type="primary"
            >查看</el-button>
            <el-button
              @click.native.prevent="editUserData(scope.row,scope.$index)"
              icon="el-icon-edit"
              size="mini"
              type="primary"
            >编辑</el-button>
            <el-button
              @click.native.prevent="deleteUserData(scope.$index,tableData)"
              icon="el-icon-delete"
              size="mini"
              type="danger"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
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
    </template>
    <el-dialog title="查看个人信息" :visible.sync="checkUserFormVisible">
      <div class="checkDatas">
        <div class="checkDataItem">
          <span class="checkDataItemTitle">工号:</span>
          <span>{{checkData.jobNumber}}</span>
        </div>
        <div class="checkDataItem">
          <span class="checkDataItemTitle">姓名:</span>
          <span>{{checkData.fullName}}</span>
        </div>
        <div class="checkDataItem">
          <span class="checkDataItemTitle">手机号码:</span>
          <span>{{checkData.mobile}}</span>
        </div>
        <div class="checkDataItem">
          <span class="checkDataItemTitle">证件类型:</span>
          <span>{{checkData.idType}}</span>
        </div>
        <div class="checkDataItem">
          <span class="checkDataItemTitle">身份证号码:</span>
          <span>{{checkData.idCard}}</span>
        </div>
        <div class="checkDataItem">
          <span class="checkDataItemTitle">银行卡号:</span>
          <span>{{checkData.bankAccount}}</span>
        </div>
        <div class="checkDataItem">
          <span class="checkDataItemTitle">开户行:</span>
          <span>{{checkData.bankName}}</span>
        </div>
        <div class="checkDataItem">
          <span class="checkDataItemTitle">注册状态:</span>
          <span>{{checkData.idCard}}</span>
        </div>
        <div class="checkDataItem">
          <span class="checkDataItemTitle">工种:</span>
          <span>{{checkData.registerStatus}}</span>
        </div>
        <div class="checkDataItem">
          <span class="checkDataItemTitle">状态:</span>
          <span>{{checkData.state}}</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="checkUserFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="userFormVisible"
      :title="isAdd?'添加个人信息':'修改个人信息'"
      :before-close="cancel"
    >
      <el-form :model="editData" :rules="rules" ref="editData">
        <el-form-item label="工号" prop="jobNumber" :label-width="formLabelWidth">
          <el-input v-model="editData.jobNumber"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="fullName" :label-width="formLabelWidth">
          <el-input v-model="editData.fullName" :disabled="!isAdd"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile" :label-width="formLabelWidth">
          <el-input v-model="editData.mobile" :disabled="!isAdd"></el-input>
        </el-form-item>
        <el-form-item label="证件类型" prop="idType" :label-width="formLabelWidth">
          <el-input v-model="editData.idType" disabled></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" prop="idCard" :label-width="formLabelWidth">
          <el-input v-model="editData.idCard" :disabled="!isAdd"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号" prop="bankAccount" :label-width="formLabelWidth">
          <el-input v-model="editData.bankAccount" :disabled="!isAdd"></el-input>
        </el-form-item>
        <el-form-item label="开户行" prop="bankName" :label-width="formLabelWidth">
          <el-input v-model="editData.bankName"></el-input>
        </el-form-item>
        <el-form-item label="注册状态" prop="registerStatus" :label-width="formLabelWidth">
          <el-input v-model="editData.registerStatus"></el-input>
        </el-form-item>
        <el-form-item label="工种" prop="typeOfWork" :label-width="formLabelWidth">
          <el-input v-model="editData.typeOfWork"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state" :label-width="formLabelWidth">
          <el-input v-model="editData.state"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="isAdd? addUserDataTrue():editUserDataTrue()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRosterList } from "@/api/table";
import url from "@/api/api.js";
import qs from "qs";
import { validatePhone, validateId } from "@/utils/validate";
export default {
  data() {
    return {
      tableData: [],
      editRowIndex: -1,
      editData: {
        jobNumber: "q",
        fullName: "q",
        sex: "女",
        mobile: "157576651",
        idType: "身份证",
        bankAccount: "1111",
        bankName: "1111",
        idCard: "111",
        registerStatus: "0",
        typeOfWork: "11",
        state: ""
      },
      checkData: {
        jobNumber: "",
        fullName: "",
        sex: "",
        mobile: "",
        idType: "",
        bankAccount: "",
        bankName: "",
        registerStatus: "",
        typeOfWork: "",
        state: ""
      },
      rules: {
        fullName: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ],
        mobile: [{ required: true, trigger: "blur", validator: validatePhone }],
        idCard: [{ required: true, trigger: "blur", validator: validateId }]
      },
      isAdd: false,
      tableChecked: [],
      checkUserFormVisible: false,
      userFormVisible: false,
      formLabelWidth: "120px",
      uploadType: "1",
      pageSize: 10,
      pageNum: 1,
      checkedMobiles: [],
      total: -1,
      currentPage: 1,
      loading: false,
      mobileValue: "",
      jobNumberValue: "",
      fullNameValue: "",
      filterDatas: {
        registerStatus: [],
        state: [],
        typeOfWork: []
      },
      filterType: ""
    };
  },
  mounted() {
    // getRosterList().then(res => {
    //   this.tableData = res.data.items;
    //   console.log(res);
    // });
    this.getDataLists();
  },
  methods: {
    stateChange(row) {
      this.$confirm("此操作将改变用户状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          row.state = row.state === "启用" ? "禁用" : "启用";
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改"
          });
        });
    },
    //单条删除
    deleteUserData(index, rows) {
      this.$confirm("此操作将删除用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.checkedMobiles = [];
          this.checkedMobiles.push(rows[index].mobile);
          this.$axios
            .post(
              url.rosterDelete,
              // qs.stringify(
              {
                mobiles: this.checkedMobiles,
                customerId: 1
              }
              //   { indices: false }
              // )
            )
            .then(res => {
              console.log(res);
              if (res.status === 200) {
                if (res.data.result === 1) {
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                  this.getDataLists();
                } else {
                  this.$message.error(res.data.msg);
                }
              } else {
                this.$message.error("删除失败");
              }
            })
            .catch(error => {
              this.$message.error("删除失败");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //批量删除
    deleteUserDatas() {
      this.$confirm("此操作将删除选中用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.checkedMobiles = [];
          for (let key in this.tableChecked) {
            this.checkedMobiles.push(this.tableChecked[key].mobile);
          }
          this.$axios
            .post(url.rosterDelete, {
              mobiles: this.checkedMobiles,
              customerId: 1
            })
            .then(res => {
              console.log(res);
              if (res.status === 200) {
                if (res.data.result === 1) {
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                  if (this.checkedMobiles.length === this.tableData.length) {
                    if (this.pageNum > 1) {
                      this.pageNum--;
                    }
                  }
                  this.getDataLists();
                } else {
                  this.$message.error(res.data.msg);
                }
              } else {
                this.$message.error("删除失败");
              }
            })
            .catch(error => {
              this.$message.error("删除失败");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //全部删除
    deleteUserDataAll() {
      this.$confirm("此操作将删除全部用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(url.rosterDeleteAll, {
              customerId: 1
            })
            .then(res => {
              console.log(res);
              if (res.status === 200) {
                if (res.data.result === 1) {
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                  this.getDataLists();
                } else {
                  this.$message.error(res.data.msg);
                }
              } else {
                this.$message.error("删除失败");
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //根据手机号，真实姓名，工号模糊查询
    handleSearch(pageNum) {
      this.$axios
        .get(url.rosterSearch, {
          params: {
            customerId: 1,
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
              this.currentPage = 1;
              this.filterType = "search";
              if (pageNum === 1) {
                this.pageNum = 1;
              }
              this.tableData = res.data.data.list;
              this.total = res.data.data.total;
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
        .get(url.rosterFilter, {
          params: {
            customerId: 1,
            registerStatusS: JSON.stringify(this.filterDatas.registerStatus),
            statusS: this.filterDatas.state,
            pageSize: pageNum,
            pageNum: this.pageNum
          }
        })
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            if (res.data.result === 1) {
              this.currentPage = 1;
              this.filterType = "filter";
              if (pageNum === 1) {
                this.pageNum = 1;
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
    resetFilter() {
      this.pageNum = 1;
      this.getDataLists();
      (this.mobileValue = ""),
        (this.jobNumberValue = ""),
        (this.fullNameValue = "");
    },
    filterStatus(filters) {
      for (var key in filters) {
        this.filterDatas[key] = filters[key];
      }
      this.handleFilter(1);
    },
    handleSelectionChange(val) {
      this.tableChecked = val;
    },
    //获取数据列表
    getDataLists() {
      this.loading = true;
      this.$axios
        .get(url.rosterLists, {
          params: {
            customerId: 1,
            pageSize: this.pageSize,
            pageNum: this.pageNum
          }
        })
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            if (res.data.result === 1) {
              this.pageNum = 1;
              this.tableData = res.data.data.list;
              this.total = res.data.data.total;
            } else {
              this.$message.error(res.data.msg);
            }
          } else {
            this.$message.error("获取数据出错！");
          }
          this.loading = false;
        })
        .catch(erroe => {
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
      this.getDataLists();
    },
    //上传文件
    beforeUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "xls";
      const extension2 = testmsg === "xlsx";
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!extension && !extension2) {
        this.$message({
          message: "上传文件只能是 xls、xlsx格式!",
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
      fd.append("customerId", 1);
      fd.append("importId", this.uploadType);
      this.$axios.post(url.rosterImportExcel, fd).then(res => {
        console.log(res);
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
    },
    //查看用户
    checkUserData(row, index) {
      this.checkUserFormVisible = true;
      let rowData = row;
      this.checkData = JSON.parse(JSON.stringify(rowData));
    },

    //添加用户
    addUserData() {
      this.isAdd = true;
      this.userFormVisible = true;
    },
    //确定添加用户
    addUserDataTrue() {
      this.$refs["editData"].validate(valid => {
        if (vaild) {
          let newData = this.editData;
          newData.customerId = 1;
          this.$axios.post(url.rosterAdd, newData).then(res => {
            console.log(res);
            this.userFormVisible = false;
            this.isAdd = false;
            if (res.status === 200) {
              if (res.data.result === 1) {
                this.getDataLists();
                this.$message.success("添加成功");
              } else {
                this.$message.error(res.data.msg);
              }
            } else {
              this.$message.error("添加失败");
            }
          });
        }
      });
    },
    //编辑用户
    editUserData(row, index) {
      this.isAdd = false;
      this.editRowIndex = index;
      this.userFormVisible = true;
      let rowData = row;
      this.editData = JSON.parse(JSON.stringify(rowData));
    },
    //确定编辑用户
    editUserDataTrue() {
      this.$axios
        .post(url.rosterEdit, {
          mobile: this.editData.mobile,
          customerId: 1,
          sex: this.editData.sex,
          typeOfWork: this.editData.typeOfWork,
          jobNumber: this.editData.jobNumber
        })
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            if (res.data.result === 1) {
              this.tableData[this.editRowIndex] = JSON.parse(
                JSON.stringify(this.editData)
              );
            } else {
              this.$message.error(res.data.msg);
            }
          } else {
            this.$message.error("编辑失败");
          }
          this.cancel();
        });
    },
    //取消添加、编辑
    cancel() {
      this.userFormVisible = false;
      for (let key in this.editData) {
        this.editData[key] = "";
      }
      this.$refs["editData"].clearValidate();
    }
  }
};
</script>


<style lang="scss" scoped>
.app-container {
  .add-container {
    margin-bottom: 10px;
  }
  .upload-demo {
    // display: flex;
    float: left;
  }

  .el-button + .el-button {
    margin-left: 0;
  }

  .filter-container {
    margin-bottom: 10px;
  }

  .checkDatas {
    width: 90%;
    font-size: 16px;
    margin: 0 auto;

    .checkDataItem {
      line-height: 30px;

      .checkDataItemTitle {
        display: inline-block;
        width: 30%;
        text-align: right;
      }
    }
  }
}
</style>


