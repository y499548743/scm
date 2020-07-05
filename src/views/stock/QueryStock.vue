<template>
  <div>
    <el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item label="产品编号">
        <el-input v-model="ruleForm.productCode"></el-input>
      </el-form-item>
      <el-form-item label="产品名称">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="库存数量最小值" prop="min">
        <el-input v-model="ruleForm.min"></el-input>
      </el-form-item>
      <el-form-item label="库存数量最大值" prop="max">
        <el-input v-model="ruleForm.max"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" stripe style="100%">
      <el-table-column prop="ordinal" label="序号">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productCode" label="产品编号">
        <template slot-scope="scope">
          <span @click="showRecord(scope.$index, scope.row)">{{scope.row.productCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="产品名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="num" label="库存数量">
        <template slot-scope="scope">
          <span>{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="poNum" label="采购在途数">
        <template slot-scope="scope">
          <span>{{scope.row.poNum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="soNum" label="预销售数">
        <template slot-scope="scope">
          <span>{{scope.row.soNum}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :total="this.result.total"
      layout="prev, pager, next"
      @current-change="goPage"
      :current-page="currPage"
    ></el-pagination>
    <el-dialog title="库存变更记录" :visible.sync="dialogTableVisible">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="入库" name="first">
          <el-table :data="instockData">
            <el-table-column prop="stockTime" label="入库时间" width="160px"></el-table-column>
            <el-table-column prop="orderCode" label="相关采购单号" width="150px"></el-table-column>
            <el-table-column prop="createUser" label="入库经手人"></el-table-column>
            <el-table-column prop="stockNum" label="入库数量"></el-table-column>
            <el-table-column prop="stockType" label="入库类型"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="出库" name="second">
          <el-table :data="outstockData">
            <el-table-column prop="stockTime" label="出库时间" width="160px"></el-table-column>
            <el-table-column prop="orderCode" label="相关销售单号" width="150px"></el-table-column>
            <el-table-column prop="createUser" label="出库库经手人"></el-table-column>
            <el-table-column prop="stockNum" label="出库数量"></el-table-column>
            <el-table-column prop="stockType" label="出库类型"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
import { requestGet } from "../../utils/http";
import { requestPost } from "../../utils/http";
export default {
  data() {
    return {
      ruleForm: {
        productCode: "",
        name: "",
        min: 0,
        max: ""
      },
      tableData: [],
      instockData: [],
      outstockData: [],
      activeName: "first",
      dialogTableVisible: false,
      currPage: 1,
      result: "",
      rules: {
        min: [{ pattern: /^\d+$/, message: "不能为负数", trigger: "blur" }],
        max: [{ pattern: /^\d+$/, message: "不能为负数", trigger: "blur" }]
      }
    };
  },
  methods: {
    onSubmit() {
      this.ruleForm["page"] = this.currPage;
      requestGet("/api/main/stock/query", this.ruleForm).then(resp => {
        this.result = resp.data;
        this.tableData = resp.data.list;
      });
    },
    showRecord(index, row) {
      console.log(row);
      requestGet("/api/main/stock/alterRecord", {
        productCode: row.productCode,
        stockType: 1
      }).then(resp => {
        this.instockData = resp.data.data.list;
        console.log(this.instockData, "instockData");
      });
      requestGet("/api/main/stock/alterRecord", {
        productCode: row.productCode,
        stockType: 2
      }).then(resp => {
        this.outstockData = resp.data.data.list;
        console.log(this.outstockData, "outstockData");
      });
      this.dialogTableVisible = true;
    },
    goPage(page) {
      this.currPage = page;
      this.ruleForm["page"] = this.currPage;
      requestGet("/api/main/stock/query", this.ruleForm).then(
        resp => {
          this.result = resp.data;
          this.tableData = this.result.list;
        }
      );
    }
  }
};
</script>
<style scoped>
.el-form .el-input {
  width: 140px;
}
</style>