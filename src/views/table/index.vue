<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="searchValue.byName"
        placeholder="按姓名搜索"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter()"
      />
      <el-input
        v-model="searchValue.byMobile"
        placeholder="按手机号码搜索"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter()"
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
        @click.native="handleFilter()"
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
      <el-table-column prop="usuFullName" label="姓名"></el-table-column>
      <el-table-column prop="usuMobile" label="手机号码"></el-table-column>
      <el-table-column prop="usuEMail" label="邮箱"></el-table-column>
      <el-table-column prop="suIsSupAdmin" label="角色"></el-table-column>
      <el-table-column prop="suStatus" label="状态">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.suStatus === 0"
            @click.native.prevent="stateChange(scope.row)"
            size="mini"
            type="primary"
          >正常</el-button>
          <el-button
            v-if="scope.row.suStatus === 1"
            @click.native.prevent="stateChange(scope.row)"
            size="mini"
            type="danger"
          >禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="suCtime" label="创建时间" width="180px">
        <template slot-scope="scope">
          <p>{{scope.row.suCtime | renderTime}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="suLtime" label="最后操作时间" width="180px">
        <template slot-scope="scope">
          <p>{{scope.row.suLtime | renderTime}}</p>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="usuPswd" label="登录密码" width="180px"></el-table-column> -->
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
      :page-sizes="[1,10, 20, 50, 100]"
      :page-size="1"
      @size-change="handleSizeChange"
      :current-page.sync="currentPage"
      @current-change="currentChange"
      class="pagination"
    ></el-pagination>
    <el-dialog
      :title="isAdd?'添加信息':'修改信息'"
      :visible.sync="dialogFormVisible"
      v-dialogDrag
      :before-close="cancel"
      :close-on-click-modal="false"
    >
      <el-form :model="editData" :rules="rules" ref="editData">
        <el-form-item label="姓名" prop="usuFullName">
          <el-input v-model="editData.usuFullName"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="usuMobile">
          <el-input v-model="editData.usuMobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="usuEMail">
          <el-input v-model="editData.usuEMail"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="suIsSupAdmin" class="form-identity">
          <el-select v-model="editData.suIsSupAdmin" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登录密码" prop="usuPswd" v-if="isAdd">
          <el-input v-model="editData.usuPswd"></el-input>
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
  validatusuEMail,
  validatePassword
} from "@/utils/validate";
import { getUserLists, addUser, updateUser, updateStatus } from "@/api/user";

export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      editRowIndex: -1,
      editData: {
        usuFullName: "12344",
        usuMobile: "15757116573",
        usuEMail: "cmy@qq.com",
        usuPswd: "123456",
        suIsSupAdmin: 0
      },
      searchValue: {
        byName: "",
        byMobile: "",
        byIdentity: ""
      },
      options: [
        {
          value: 0,
          label: "管理员"
        },
        {
          value: 1,
          label: "普通用户"
        }
      ],
      rules: {
        usuFullName: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ],
        usuMobile: [
          { required: true, trigger: "blur", validator: validatePhone }
        ],
        usuEMail: [
          { required: true, trigger: "blur", validator: validatusuEMail }
        ],
        usuPswd: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      isAdd: false,
      total: 0,
      pageNum: 1,
      pageSize: 1,
      currentPage: 1,
      loading: true,
      cId: 1
    };
  },
  mounted() {
    if (this.$route.query.pageNum) {
      this.pageNum = parseInt(this.$route.query.pageNum);
    }
    if (this.$route.query.pageSize) {
      this.pageSize = parseInt(this.$route.query.pageSize);
    }
    console.log(this.pageNum);
    this.getUserLists();
  },
  methods: {
    //获取数据列表
    getUserLists() {
      this.loading = true;
      getUserLists({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        cId: this.cId,
        usuMobile: this.searchValue.byMobile,
        usuFullName: this.searchValue.byName,
        suIsSupAdmin: this.searchValue.byIdentity
      })
        .then(res => {
          this.tableData = res.data.list;
          this.total = res.data.total;
          this.currentPage = this.pageNum;
          this.loading = false;
        })
        .catch(error => {
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
          updateStatus({
            cId: this.cId,
            suStatus: 1 - row.suStatus,
            usuMobile: row.usuMobile
          }).then(res => {
            this.$message.success("修改成功!");
            row.suStatus = 1 - row.suStatus;
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
      this.dialogFormVisible = true;
    },
    //编辑用户确认
    editUserDataTrue() {
      this.$refs["editData"].validate(valid => {
        if (valid) {
          updateUser(this.editData).then(res => {
            this.$message.success("修改成功");
            this.tableData[this.editRowIndex] = JSON.parse(
              JSON.stringify(this.editData)
            );
          });
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
      this.$refs["editData"].clearValidate();
      this.isAdd = false;
    },
    //模糊字段查询
    handleFilter() {
      this.pageNum = 1;
      this.getUserLists();
    },
    //重置查询
    resetFilter() {
      for (key in this.searchValue) {
        this.searchValue[key] = "";
      }
      this.pageNum = 1;
      this.getUserLists();
    },
    //添加用户
    addUserData() {
      this.isAdd = true;
      this.dialogFormVisible = true;
    },
    //确定添加用户
    addUserDataTrue(editData) {
      this.$refs["editData"].validate(valid => {
        if (valid) {
          let newData = this.editData;
          newData.cId = this.cId;
          addUser(newData).then(res => {
            this.$message.success("添加成功");
            this.getUserLists();
          });
          this.cancel();
        }
      });
    },
    //换页
    currentChange(currentPage) {
      this.pageNum = currentPage;
      this.$router.replace({
        path: "/table",
        query: { pageNum: this.pageNum, pageSize: this.pageSize }
      });
    },
    //改变每页数据量
    handleSizeChange(size) {
      this.pageSize = size;
      this.pageNum = 1;
      this.$router.replace({
        path: "/table",
        query: { pageNum: this.pageNum, pageSize: this.pageSize }
      });
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
  },
  watch: {
    // 监听路由变化，随时获取新的列表信息
    $route: {
      handler: function(route) {
        this.getUserLists();
      },
      immediate: true
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
