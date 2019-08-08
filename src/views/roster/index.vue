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
    <el-dialog
      title="查看个人信息"
      :visible.sync="checkUserFormVisible"
      v-dialogDrag
      :close-on-click-modal="false"
    >
      <el-form :model="checkData">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="工号" prop="jobNumber">
              <el-input v-model="checkData.jobNumber" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="姓名" prop="fullName">
              <el-input v-model="checkData.fullName" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="checkData.mobile" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3">
            <el-form-item label="性别" prop="sex">
              <el-input v-model="checkData.sex" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="证件类型" prop="idType">
              <el-input v-model="checkData.idType" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item label="身份证号码" prop="idCard">
              <el-input v-model="checkData.idCard" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="银行卡号" prop="bankAccount">
              <el-input v-model="checkData.bankAccount" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户行" prop="bankName">
              <el-input v-model="checkData.bankName" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="注册状态" prop="registerStatus">
              <el-input v-model="checkData.registerStatus" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工种" prop="typeOfWork">
              <el-input v-model="checkData.typeOfWork" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="state">
              <el-input v-model="checkData.state" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="checkUserFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="userFormVisible"
      :title="isAdd?'添加个人信息':'修改个人信息'"
      v-dialogDrag
      :close-on-click-modal="false"
      :before-close="cancel"
    >
      <el-form :model="editData" :rules="rules" ref="editData">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="工号" prop="jobNumber">
              <el-input v-model="editData.jobNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="姓名" prop="fullName">
              <el-input v-model="editData.fullName" :disabled="!isAdd"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="editData.mobile" :disabled="!isAdd"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3">
            <el-form-item label="性别" prop="sex">
              <el-input v-model="editData.sex"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="证件类型" prop="idType">
              <el-input v-model="editData.idType" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item label="身份证号码" prop="idCard">
              <el-input v-model="editData.idCard" :disabled="!isAdd"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="银行卡号" prop="bankAccount">
              <el-input v-model="editData.bankAccount" :disabled="!isAdd"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户行" prop="bankName">
              <el-input v-model="editData.bankName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="注册状态" prop="registerStatus">
              <el-input v-model="editData.registerStatus"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工种" prop="typeOfWork">
              <el-input v-model="editData.typeOfWork"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="state">
              <el-input v-model="editData.state"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="isAdd? addUserDataTrue():editUserDataTrue()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./index.js"></script>

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
}
</style>


