<template>
  <div class="app-container">
    <template>
      <div class="filter-container">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          accept="xls"
          :on-exceed="handleExceed"
        >
          <el-button size="small" type="primary">点击上传excel</el-button>
          <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且不超过500kb</div>
        </el-upload>
        <el-input
          v-model="searchValue"
          placeholder="按手机号、工号、姓名搜索"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
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
          type="danger"
          icon="el-icon-delete"
          @click="dataDelete"
        >删除选中</el-button>
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-add"
          @click="addUserData"
        >新增</el-button>
      </div>
      <el-table
        :data="isFilter? filterTableData: tableData"
        ref="rosterTable"
        border
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="num" label="序号" width="50px"></el-table-column>
        <el-table-column prop="id" label="工号"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="phone" label="手机号码"></el-table-column>
        <el-table-column prop="cardType" label="证件类型"></el-table-column>
        <el-table-column prop="idCard" label="身份证号码"></el-table-column>
        <el-table-column prop="bankCard" label="银行卡号"></el-table-column>
        <el-table-column prop="bank" label="开户行"></el-table-column>
        <el-table-column
          prop="status"
          label="注册状态"
          width="120"
          :filters="[{ text: '待注册', value: 'stay' }, { text: '注册失败', value: 'error' }, { text: '注册成功', value: 'success' }]"
          :filter-method="filterStatus"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="info"
              icon="el-icon-warning"
              v-show="scope.row.status=='stay'"
            >待注册</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-error"
              v-show="scope.row.status=='error'"
            >注册失败</el-button>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-success"
              v-show="scope.row.status=='success'"
            >注册成功</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="工种"
          :filters="[{ text: '财务', value: '财务' }, { text: '出纳', value: '出纳' }, { text: '经理', value: '经理' }]"
          :filter-method="filterType"
          filter-placement="bottom-end"
        ></el-table-column>
        <el-table-column
          prop="state"
          width="100"
          label="状态"
          :filters="[{ text: '禁用', value: 'forbidden' }, { text: '启用', value: 'success' }]"
          :filter-method="filterState"
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
              @click.native.prevent="dataDelete(scope.$index,tableData)"
              icon="el-icon-delete"
              size="mini"
              type="danger"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-dialog title="查看个人信息" :visible.sync="checkUserFormVisible">
      <el-form :model="checkData">
        <el-form-item label="工号" prop="id" :label-width="formLabelWidth">
          <el-input v-model="checkData.id"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="num" :label-width="formLabelWidth">
          <el-input v-model="checkData.num"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone" :label-width="formLabelWidth">
          <el-input v-model="checkData.phone"></el-input>
        </el-form-item>
        <el-form-item label="证件类型" prop="cardType" :label-width="formLabelWidth">
          <el-input v-model="checkData.cardType"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" prop="idCard" :label-width="formLabelWidth">
          <el-input v-model="checkData.idCard"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号" prop="bankCard" :label-width="formLabelWidth">
          <el-input v-model="checkData.bankCard"></el-input>
        </el-form-item>
        <el-form-item label="开户行" prop="bank" :label-width="formLabelWidth">
          <el-input v-model="checkData.bank"></el-input>
        </el-form-item>
        <el-form-item label="注册状态" prop="status" :label-width="formLabelWidth">
          <el-input v-model="checkData.status"></el-input>
        </el-form-item>
        <el-form-item label="工种" prop="type" :label-width="formLabelWidth">
          <el-input v-model="checkData.type"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state" :label-width="formLabelWidth">
          <el-input v-model="checkData.state"></el-input>
        </el-form-item>
      </el-form>
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
        <el-form-item label="工号" prop="id" :label-width="formLabelWidth">
          <el-input v-model="editData.id"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="num" :label-width="formLabelWidth">
          <el-input v-model="editData.num" :disabled="!isAdd"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone" :label-width="formLabelWidth">
          <el-input v-model="editData.phone" :disabled="!isAdd"></el-input>
        </el-form-item>
        <el-form-item label="证件类型" prop="cardType" :label-width="formLabelWidth">
          <el-input v-model="editData.cardType" :disabled="!isAdd"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" prop="idCard" :label-width="formLabelWidth">
          <el-input v-model="editData.idCard" :disabled="!isAdd"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号" prop="bankCard" :label-width="formLabelWidth">
          <el-input v-model="editData.bankCard" :disabled="!isAdd"></el-input>
        </el-form-item>
        <el-form-item label="开户行" prop="bank" :label-width="formLabelWidth">
          <el-input v-model="editData.bank"></el-input>
        </el-form-item>
        <el-form-item label="注册状态" prop="status" :label-width="formLabelWidth">
          <el-input v-model="editData.status"></el-input>
        </el-form-item>
        <el-form-item label="工种" prop="type" :label-width="formLabelWidth">
          <el-input v-model="editData.type"></el-input>
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
export default {
  data() {
    return {
      tableData: [],
      editRowIndex: -1,
      editData: {
        id: "",
        num: "",
        phone: "",
        cardType: "",
        bankCard: "",
        bank: "",
        status: "",
        type: "",
        state: ""
      },
      checkData: {
        id: "",
        num: "",
        phone: "",
        cardType: "",
        bankCard: "",
        bank: "",
        status: "",
        type: "",
        state: ""
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
      searchValue: "",
      rules: {
        name: [
          { required: true, message: "姓名不能为空", trigger: "change" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "change" }
        ]
      },
      filterTableData: [],
      isFilter: false,
      isAdd: false,
      date: "",
      tableChecked: [],
      ids: [],
      checkUserFormVisible: false,
      userFormVisible: false,
      formLabelWidth: "120px",
      isAdd: ""
    };
  },
  mounted() {
    getRosterList().then(res => {
      this.tableData = res.data.items;
      console.log(res);
    });
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
    handleFilter() {
      if (this.searchValue === "") {
        this.isFilter = false;
        return;
      }
      // this.currentPage = 1;
      this.filterTableData = [];
      (this.filterTableData = this.tableData.filter(data => {
        return (
          String(data.name).indexOf(String(this.searchValue)) > -1 ||
          String(data.phone).indexOf(String(this.searchValue)) > -1 ||
          String(data.id).indexOf(String(this.searchValue)) > -1
        );
      })),
        // this.total = this.filterTableData.length;
        // this.currentChange(1);
        (this.isFilter = true);
    },
    resetFilter() {
      this.isFilter = false;
      // this.total = this.tableData.length;
      // this.currentPage = 1;
      this.searchValue = "";
    },
    filterState(value, row) {
      return row.state === value;
    },
    filterStatus(value, row) {
      return row.status === value;
    },
    filterType(value, row) {
      return row.type === value;
    },
    handleSelectionChange(val) {
      this.tableChecked = val;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
      console.log(1);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    //查看用户
    checkUserData(row, index) {
      this.checkUserFormVisible = true;
      this.checkData = row;
    },
    //编辑用户
    editUserData(row, index) {
      this.isAdd = false;
      this.editRowIndex = index;
      this.userFormVisible = true;
      let rowData = row;
      this.editData = JSON.parse(JSON.stringify(rowData));
    },

    //添加用户
    addUserData() {
      this.isAdd = true;
      this.userFormVisible = true;
    },
    //确定添加用户
    addUserDataTrue() {
      let newData = this.editData;
      this.tableData.push(JSON.parse(JSON.stringify(newData)));
      this.userFormVisible = false;
      this.isAdd = false;
    },
    //确定编辑用户
    editUserDataTrue() {
      this.tableData[this.editRowIndex] = this.editData;
      this.cancel();
    },
    //取消修改
    cancel() {
      this.userFormVisible = false;
      (this.editData = {
        id: "",
        num: "",
        phone: "",
        cardType: "",
        bankCard: "",
        bank: "",
        status: "",
        type: "",
        state: ""
      }),
        this.$refs["editData"].clearValidate();
    }
  }
};
</script>


<style lang="scss" scoped>
.app-container {
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
}
</style>


