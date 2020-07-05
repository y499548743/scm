<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="相关单据号">
        <el-input v-model="formInline.no"></el-input>
      </el-form-item>
      <el-form-item label="收支类型">
        <el-select v-model="formInline.type" prop="type">
          <el-option label="收入" value="收入"></el-option>
          <el-option label="支出" value="支出"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期范围">
        <el-date-picker
          v-model="formInline.dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="起始日期"
          end-placeholder="截止日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="付款方式">
        <el-select v-model="formInline.payType">
          <el-option label="货到付款" value="1"></el-option>
          <el-option label="款到发货" value="2"></el-option>
          <el-option label="预付款到发货" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="payData" stripe style="100%" v-if="payShow">
      <el-table-column prop="ordinal" label="序号">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payTime" label="付款日期">
        <template slot-scope="scope">
          <span>{{scope.row.payTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ordercode" label="采购单编号">
        <template slot-scope="scope">
          <span>{{scope.row.ordercode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payPrice" label="付款金额">
        <template slot-scope="scope">
          <span>{{scope.row.payPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="account" label="经手人">
        <template slot-scope="scope">
          <span>{{scope.row.account}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payType" label="付款方式">
        <template slot-scope="scope">
          <span>{{scope.row.payType|paytype}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-table :data="receiptData" stripe style="100%" v-if="receiptShow">
      <el-table-column prop="ordinal" label="序号">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payTime" label="收款日期">
        <template slot-scope="scope">
          <span>{{scope.row.payTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ordercode" label="销售单编号">
        <template slot-scope="scope">
          <span>{{scope.row.ordercode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payPrice" label="收款金额">
        <template slot-scope="scope">
          <span>{{scope.row.payPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="account" label="经手人">
        <template slot-scope="scope">
          <span>{{scope.row.account}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payType" label="付款方式">
        <template slot-scope="scope">
          <span>{{scope.row.payType|paytype}}</span>
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
  </div>
</template>
<script>
import { requestGet } from "../../utils/http";
export default {
  data() {
    return {
      formInline: {
        no: "",
        type: "",
        dateValue: ""
      },
      payData: [],
      receiptData: [],
      currPage: 1,
      result: "",
      payShow: false,
      receiptShow: false
    };
  },
  filters: {
    paytype(value) {
      if (value == 1) {
        return "货到付款";
      }
      if (value == 2) {
        return "款到发货";
      }
      if (value == 3) {
        return "预付款到发货";
      }
    }
  },
  methods: {
    onSubmit() {
      let startDate = this.formInline.dateValue[0];
      let endDate = this.formInline.dateValue[1];
      this.formInline["startDate"] = startDate;
      this.formInline["endDate"] = endDate;
      this.formInline["page"] = this.currPage;
      console.log(this.formInline);
      requestGet("/api/main/finance/query", this.formInline).then(resp => {
        if (this.formInline.type == "支出") {
          this.payShow = true;
          this.receiptShow = false;
          this.result = resp.data;
          this.payData = resp.data.list;
          console.log(this.payData, "pay");
        }
        if (this.formInline.type == "收入") {
          this.receiptShow = true;
          this.payShow = false;
          this.result = resp.data;
          this.receiptData = resp.data.list;
          console.log(this.receiptData, "receipt");
        }
      });
    },
    goPage(page) {
      this.currPage = page;
      this.formInline["page"] = this.currPage;
      requestGet("/api/main/finance/query", this.formInline).then(resp => {
        if (this.formInline.type == "支出") {
          this.payShow = true;
          this.receiptShow = false;
          this.result = resp.data;
          this.payData = resp.data.list;
          console.log(this.payData, "pay");
        }
        if (this.formInline.type == "收入") {
          this.receiptShow = true;
          this.payShow = false;
          this.result = resp.data;
          this.receiptData = resp.data.list;
          console.log(this.receiptData, "receipt");
        }
      });
    }
  }
};
</script>
<style scoped>
.vcipt {
  width: 217px;
}
</style>