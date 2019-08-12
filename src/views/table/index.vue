<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="searchValue.byName"
        placeholder="按姓名搜索"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter(1)"
      />
      <el-input
        v-model="searchValue.byPhone"
        placeholder="按手机号码搜索"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter(1)"
      />
      <el-select v-model="searchValue.byIdentity" placeholder="按角色搜索">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button
        class="filter-item"
        type="primary"
        @click.native="handleFilter(1)"
        style="margin-left: 23px"
      >搜索</el-button>
      <el-button
        class="filter-item"
        type="primary"
        @click.native="resetFilter"
        style="margin-left: 10px"
      >重置</el-button>
      <el-button
        class="filter-item"
        style="margin-right: 30px; float:right"
        type="primary"
        @click="addUserData"
      >添加</el-button>
    </div>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      v-loading="loading"
      :header-cell-style="{background:'#E1E1E1'}"
    >
      <!-- <el-table-column prop="customerId" label="序号"></el-table-column> -->
      <el-table-column prop="fullName" label="姓名"></el-table-column>
      <el-table-column prop="mobile" label="手机号码"></el-table-column>
      <el-table-column prop="eMail" label="邮箱"></el-table-column>
      <el-table-column prop="customerSysUserInfos.roles" label="角色"></el-table-column>
      <el-table-column prop="customerSysUserInfos.isForbidden" label="状态">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.customerSysUserInfos.isForbidden === 0"
            @click.native.prevent="stateChange(scope.row)"
            size="mini"
            type="primary"
          >正常</el-button>
          <el-button
            v-if="scope.row.customerSysUserInfos.isForbidden === 1"
            @click.native.prevent="stateChange(scope.row)"
            size="mini"
            type="danger"
          >禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="customerSysUserInfos.createTime" label="创建时间" width="180px">
        <template slot-scope="scope">
          <p>{{scope.row.customerSysUserInfos.createTime | renderTime}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="customerSysUserInfos.lastOperateTime" label="最后操作时间" width="180px">
        <template slot-scope="scope">
          <p>{{scope.row.customerSysUserInfos.lastOperateTime | renderTime}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="pswd" label="登录密码"></el-table-column>
      <el-table-column width="180" label="操作">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="editUserData(scope.row,scope.$index)"
            size="mini"
            type="primary"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="sizes,prev, pager, next"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="10"
      @size-change="handleSizeChange"
      :current-page.sync="currentPage"
      @current-change="currentChange"
      class="pagination"
    ></el-pagination>
    <el-dialog
      :title="isAdd?'添加信息':'修改信息'"
      :visible.sync="dialogFormVisible"
      :before-close="cancel"
      v-dialogDrag
    >
      <el-form :model="editData" :rules="rules" ref="editData">
        <el-form-item label="姓名" prop="fullName">
          <el-input v-model="editData.fullName"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editData.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="eMail">
          <el-input v-model="editData.eMail"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="customerSysUserInfos.roles" class="form-identity">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登录密码" prop="pswd">
          <el-input v-model="editData.pswd"></el-input>
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
import {
  validatePhone,
  validateMail,
  validatePassword
} from "@/utils/validate";
import { getList } from "@/api/table";
import { dateToString } from "@/utils/date";
import url from "@/api/api.js";

export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      editRowIndex: -1,
      editData: {
        customerId: "",
        fullName: "12344",
        mobile: "15757116573",
        eMail: "cmy@qq.com",
        pswd: "123456",
        customerSysUserInfos: {
          roles: "",
          createTime: "",
          lastOperateTime: ""
        }
      },
      searchValue: {
        byName: "",
        byPhone: "",
        byIdentity: ""
      },
      options: [
        {
          value: "管理员",
          label: "管理员"
        },
        {
          value: "普通用户",
          label: "普通用户"
        }
      ],
      value: 0,
      rules: {
        fullName: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ],
        mobile: [{ required: true, trigger: "blur", validator: validatePhone }],
        eMail: [{ required: true, trigger: "blur", validator: validateMail }],
        pswd: [{ required: true, trigger: "blur", validator: validatePassword }]
      },
      isFilter: false,
      isAdd: false,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      currentPage: 1,
      loading: true,
      customerId: 1
    };
  },
  mounted() {
    this.getUserLists();
  },
  methods: {
    //获取数据列表
    getUserLists() {
      this.loading = true;
      this.$axios
        .get(url.userLists, {
          params: {
            customerId: this.customerId,
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }
        })
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            if (res.data.result === 1) {
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
        .catch(error => {
          this.$message.error("获取数据出错！");
          this.loading = false;
        });
    },
    //禁用、启用用户
    stateChange(row) {
      this.$confirm("此操作将改变用户状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(url.userForbidden, {
              customerId: this.customerId,
              isForbidden: 1 - row.customerSysUserInfos.isForbidden,
              mobile: row.mobile
            })
            .then(res => {
              console.log(res);
              if (res.status === 200) {
                if (res.data.result === 1) {
                  this.$message.success("修改成功!");
                  row.customerSysUserInfos.isForbidden =
                    1 - row.customerSysUserInfos.isForbidden;
                } else {
                  this.$message.error(res.data.msg);
                }
              } else {
                this.$message.error("修改失败");
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改"
          });
        });
    },
    //编辑用户
    editUserData(row, index) {
      this.editRowIndex = index;
      this.editData = JSON.parse(JSON.stringify(row));
      this.value = row.customerSysUserInfos.roles;
      this.dialogFormVisible = true;
    },
    //编辑用户确认
    editUserDataTrue() {
      this.$refs["editData"].validate(valid => {
        if (valid) {
          this.$axios
            .post(url.userEdit, {
              mobile: this.editData.mobile,
              customerId: this.customerId,
              fullName: this.editData.fullName,
              eMail: this.editData.eMail,
              roles: this.editData.customerSysUserInfos.roles
            })
            .then(res => {
              console.log(res);
              if (res.status === 200) {
                if (res.data.result === 1) {
                  this.$message.success("编辑成功");
                  this.tableData[this.editRowIndex] = JSON.parse(
                    JSON.stringify(this.editData)
                  );
                  this.tableData[
                    this.editRowIndex
                  ].customerSysUserInfos.roles = this.value;
                } else {
                  this.$message.error(res.data.msg);
                }
              } else {
                this.$message.error("编辑失败");
              }
              this.cancel();
            });
        }
      });
    },
    //取消修改
    cancel() {
      this.dialogFormVisible = false;
      for (let key in this.editData) {
        this.editData[key] = "";
      }
      this.value = -1;
      this.$refs["editData"].clearValidate();
    },
    //模糊字段查询
    handleFilter(pageNum) {
      if (
        this.searchValue.byName === "" &&
        this.searchValue.byPhone === "" &&
        this.searchValue.byIdentity === ""
      ) {
        this.getUserLists();
        this.isFilter = false;
        return;
      }
      this.loading = true;
      this.$axios
        .get(url.userLists, {
          params: {
            mobile: this.searchValue.byPhone,
            fullName: this.searchValue.byName,
            roles: this.searchValue.byIdentity,
            customerId: this.customerId,
            pageNum: pageNum,
            pageSize: this.pageSize
          }
        })
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            if (res.data.result === 1) {
              this.isFilter = true;
              if (pageNum === 1) {
                this.pageNum = 1;
                this.currentPage = 1;
              }
              this.tableData = res.data.data.list;
              this.total = res.data.data.total;
            } else {
              this.$message.error(res.data.msg);
            }
          } else {
            this.$message.error("查询出错！");
          }
          this.loading = false;
        })
        .catch(error => {
          this.$message.error("查询出错！");
          this.loading = false;
        });
    },
    //重置查询
    resetFilter() {
      this.isFilter = false;
      this.currentPage = 1;
      this.pageNum = 1;
      this.getUserLists();
      this.searchValue.byName = "";
      this.searchValue.byPhone = "";
      this.searchValue.byIdentity = "";
    },
    //添加用户
    addUserData() {
      this.isAdd = true;
      this.dialogFormVisible = true;
      this.value = "管理员";
    },
    //确定添加用户
    addUserDataTrue(editData) {
      this.$refs["editData"].validate(valid => {
        if (valid) {
          let newData = this.editData;
          delete newData["customerSysUserInfos"];
          newData.roles = this.value;
          newData.customerId = this.customerId;
          this.$axios
            .post(url.userAdd, newData)
            .then(res => {
              if (res.status === 200) {
                if (res.data.result === 1) {
                  console.log(res);
                  this.$message.success("添加成功");
                  if (this.isFilter) {
                    this.handleFilter(this.pageNum);
                  } else {
                    this.getUserLists();
                  }
                } else {
                  this.$message.error(res.data.msg);
                }
              } else {
                this.$message.error("添加失败");
              }
            })
            .catch(error => {
              this.$message.error("添加失败");
            });
          this.dialogFormVisible = false;
          this.isAdd = false;
        }
      });
    },
    //换页
    currentChange(currentPage) {
      this.pageNum = currentPage;
      if (this.isFilter) {
        this.handleFilter(this.pageNum);
      } else {
        this.getUserLists();
      }
    },
    //改变每页数据量
    handleSizeChange(size) {
      this.pageSize = size;
      this.pageNum = 1;
      this.currentPage = 1;
      if (this.isFilter) {
        this.handleFilter(this.pageNum);
      } else {
        this.getUserLists();
      }
    }
  },
  filters: {
    renderTime(date) {
      var dateee = new Date(date).toJSON();
      return new Date(+new Date(dateee) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 0;
  .filter-container {
    height: 100px;
    background: #f9f9f9;
    padding-top: 30px;
    padding-left: 30px;
    .el-button {
      height: 40px;
    }
  }
  .pagination {
    margin-top: 10px;
    margin-bottom: 10px;
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

// .el-form-item {
//   margin-bottom: 10px;
// }
// .form-identity {
//   margin-top: 20px;
// }
</style>
