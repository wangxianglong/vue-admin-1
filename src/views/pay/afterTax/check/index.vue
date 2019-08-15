<template>
  <div class="app">
    <div class="data-check">
      <h1>核对批量付款数据</h1>
      <div class="data-check-info"></div>
      <div class="data-check-lists">
        <table border cellpadding="0" cellspacing="0" class="data-check-table">
          <tr>
            <td class="table-title">January</td>
            <td class="table-text">$100</td>
            <td class="table-title">January</td>
            <td class="table-text">$100</td>
          </tr>
          <tr>
            <td class="table-title">January</td>
            <td class="table-text">$100</td>
            <td class="table-title">January</td>
            <td class="table-text">$100</td>
          </tr>
          <tr>
            <td class="table-title">January</td>
            <td class="table-text">$100</td>
            <td class="table-title">January</td>
            <td class="table-text">$100</td>
          </tr>
          <tr>
            <td class="table-title">January</td>
            <td class="table-text">$100</td>
            <td class="table-title">January</td>
            <td class="table-text">$100</td>
          </tr>
          <tr>
            <td class="table-title">January</td>
            <td class="table-text">$100</td>
            <td class="table-title">January</td>
            <td class="table-text">$100</td>
          </tr>
          <tr>
            <td class="table-title">January</td>
            <td class="table-text">$100</td>
            <td class="table-title">January</td>
            <td class="table-text">$100</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="person-check">
      <h1>身份验证</h1>
      <el-form label-position="right" label-width="80px">
        <el-form-item label="手机号">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="验证号码">
          <el-input v-model="code"></el-input>
        </el-form-item>
      </el-form>
      <div class="buttons">
        <el-button type="primary" @click.native="commit">提交付款请求</el-button>
        <el-button type="primary">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      myIndex: null,
      code: "",
      pageNum: 1,
      pageSize: 10
    };
  },
  mounted() {
    this.myIndex = this.$route.params.id;
    this.pageNum = this.$route.query.pageNum || this.pageNum;
    if (this.$route.query.pageNum) {
      this.pageSize = this.$route.query.pageSize;
      this.currentPage = parseInt(this.pageSize);
    }
  },
  methods: {
    commit() {
      this.$router.push({
        path: "/afterTax/",
        query: { pageNum: this.pageNum, pageSize: this.pageSize }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.app {
  padding: 20px;
  h1 {
    border-left: 5px solid #4d7cfe;
    padding-left: 15px;
  }
  .data-check {
    .data-check-lists {
      tr td {
        padding: 10px 20px;
      }
      .data-check-table {
        width: 100%;
        .table-title {
          width: 15%;
          background-color: #e1e1e1;
        }
        .table-text {
          width: 35%;
        }
      }
    }
  }
  .person-check {
    width: 30%;
    .buttons {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>