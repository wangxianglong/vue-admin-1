<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="searchValue.byName"
        placeholder="按姓名搜索"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="searchValue.byPhone"
        placeholder="按手机号码搜索"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="searchValue.byIdentity" placeholder="按角色搜索">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button-group>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click.native="handleFilter"
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
        type="primary"
        icon="el-icon-edit"
        @click="dataCreate"
      >添加</el-button>
    </div>
    <el-table
      :data="isFilter? filterTableData.slice((currentPage-1)*pagesize,currentPage*pagesize) : tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      stripe
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="customerId" label="序号"></el-table-column>
      <el-table-column prop="fullName" label="姓名"></el-table-column>
      <el-table-column prop="mobile" label="手机号码"></el-table-column>
      <el-table-column prop="eMail" label="邮箱"></el-table-column>
      <el-table-column prop="roles" label="角色"></el-table-column>
      <el-table-column prop="isForbidden" label="状态">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.isForbidden === 0"
            @click.native.prevent="stateChange(scope.row)"
            size="mini"
            type="primary"
          >正常</el-button>
          <el-button
            v-if="scope.row.isForbidden === 1"
            @click.native.prevent="stateChange(scope.row)"
            size="mini"
            type="danger"
          >禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="创建时间"></el-table-column>
      <el-table-column prop="lastDate" label="最后操作时间"></el-table-column>
      <el-table-column prop="pswd" label="登录密码"></el-table-column>
      <el-table-column width="180">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="dataChange(scope.row,scope.$index)"
            size="mini"
            type="primary"
          >编辑</el-button>
          <el-button
            @click.native.prevent="dataDelete(scope.$index,tableData)"
            size="mini"
            type="danger"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="currentPage"
      @current-change="currentChange"
    ></el-pagination>
    <el-dialog
      :title="isAdd?'添加信息':'修改信息'"
      :visible.sync="dialogFormVisible"
      :before-close="cancel"
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
        <el-form-item label="角色" prop="roles" class="form-identity">
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
        <el-button type="primary" @click="isAdd? dataCreated():dataChanged()">确 定</el-button>
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
        roles: "",
        createDate: "",
        lastDate: "",
        pswd: "123456"
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
      filterTableData: [],
      isFilter: false,
      isAdd: false,
      total: 0,
      pagesize: 10,
      currentPage: 1,
      loading: true
    };
  },
  created() {
    getList().then(res => {
      this.tableData = res.data.items;
      this.total = res.data.total;
      this.loading = false;
    });
  },
  mounted() {
    // this.$axios
    //   .get(url.userLists, {
    //     params: {
    //       pageNum: 1,
    //       pageSize: 10
    //     }
    //   })
    //   .then(res => {
    //     console.log(res);
    //     this.tableData = res.data.data.list;
    //     this.loading = false;
    //   });
  },
  methods: {
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
              customerId: 1,
              isForbidden: row.isForbidden
            })
            .then(res => {
              console.log(res);
            });
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          row.isForbidden = row.isForbidden === 0 ? 1 : 0;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改"
          });
        });
    },
    //删除用户
    dataDelete(index, rows) {
      this.$confirm("此操作将删除用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          rows.splice(index, 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //编辑弹框
    dataChange(row, index) {
      this.editRowIndex = index;
      let rowData = row;
      this.editData = JSON.parse(JSON.stringify(rowData));
      this.value = rowData.roles;
      this.dialogFormVisible = true;
    },
    //编辑修改
    dataChanged() {
      this.$refs["editData"].validate(valid => {
        if (valid) {
          this.tableData[this.editRowIndex] = JSON.parse(
            JSON.stringify(this.editData)
          );
          this.tableData[this.editRowIndex]["roles"] = this.value;
          this.cancel();
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
    handleFilter() {
      if (
        this.searchValue.byName === "" &&
        this.searchValue.byPhone === "" &&
        this.searchValue.byIdentity === ""
      ) {
        this.isFilter = false;
        return;
      }
      this.currentPage = 1;
      this.filterTableData = [];
      (this.filterTableData = this.tableData.filter(data => {
        return (
          String(data.fullName).indexOf(String(this.searchValue.byName)) > -1 &&
          String(data.mobile).indexOf(String(this.searchValue.byPhone)) > -1 &&
          String(data.roles).indexOf(String(this.searchValue.byIdentity)) > -1
        );
      })),
        (this.total = this.filterTableData.length);
      this.currentChange(1);
      this.isFilter = true;
    },
    //重置查询
    resetFilter() {
      this.isFilter = false;
      this.total = this.tableData.length;
      this.currentPage = 1;
      this.searchValue.byName = "";
      this.searchValue.byPhone = "";
      this.searchValue.byIdentity = "";
    },
    //新建用户弹框
    dataCreate() {
      this.isAdd = true;
      this.dialogFormVisible = true;
      this.value = "管理员";
    },
    //新建用户修改
    dataCreated(editData) {
      this.$refs["editData"].validate(valid => {
        if (valid) {
          let newData = this.editData;
          newData.roles = this.value;
          newData.createDate = dateToString(new Date());
          newData.lastDate = dateToString(new Date());
          newData.isForbidden = 0;
          this.tableData.push(JSON.parse(JSON.stringify(newData)));
          this.total++;
          this.$axios.post(url.userAdd, newData).then(res => {
            console.log(res);
          });
          this.dialogFormVisible = false;
          this.isAdd = false;
        }
      });
    },
    //换页
    currentChange(currentPage) {
      this.currentPage = currentPage;
    }
  }
};
</script>

<style lang="scss" scoped>
.filter-container {
  height: 40px;
  .el-button {
    height: 40px;
  }
}
.el-form-item {
  margin-bottom: 10px;
}
.form-identity {
  margin-top: 20px;
}
</style>
