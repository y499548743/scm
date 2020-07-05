<template>
  <div>
    <el-date-picker
      v-model="dateValue"
      type="month"
      placeholder="选择月"
      format="yyyy 年 MM 月"
      value-format="yyyy-MM"
    ></el-date-picker>
    <el-button type="primary" @click="onSubmit">查询</el-button>
    <h3>主信息</h3>
    <el-table :data="mainData" stripe style="100%">
      <!-- <el-table-column prop="ordinal" label="序号">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>-->
      <el-table-column prop="totalnum" label="采购单总数">
        <template slot-scope="scope">
          <span>{{scope.row.totalnum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endtotalnum" label="已了结数">
        <template slot-scope="scope">
          <span>{{scope.row.endtotalnum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="pototal" label="采购单总金额">
        <template slot-scope="scope">
          <span>{{scope.row.pototal}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalpay" label="已付款金额">
        <template slot-scope="scope">
          <span>{{scope.row.totalpay}}</span>
        </template>
      </el-table-column>
    </el-table>
    <h3>明细信息</h3>
    <el-table :data="detailData" stripe style="100%">
      <el-table-column prop="ordinal" label="序号" width="50px">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="poId" label="采购单编号" width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.poId}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="venderName" label="供应商名称" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.venderName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="160px">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="account" label="创建用户" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.account}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="poTotal" label="采购单总金额">
        <template slot-scope="scope">
          <span>{{scope.row.poTotal}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unpaid" label="未付款金额">
        <template slot-scope="scope">
          <span>{{scope.row.unpaid}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payType" label="付款方式">
        <template slot-scope="scope">
          <span>{{scope.row.payType|paytype}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="prePayFee" label="最低预付款金额" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.prePayFee}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="采购单状态">
        <template slot-scope="scope">
          <span>{{scope.row.status|status}}</span>
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
      dateValue: "",
      mainData: [],
      detailData: [],
      currPage: 1,
      result:'',
    };
  },
  methods: {
    onSubmit() {
      let date = this.dateValue;
      console.log(date);
      requestGet("/api/main/report/pomain/main", { time: date }).then(resp => {
        let res = resp.data;
        console.log(res);
        this.mainData.length = 0;
        this.mainData.push(res);
        console.log(this.mainData);
        this.result = res.details;
        this.detailData = res.details.list;
        for (let i = 0; i < this.detailData.length; i++) {
          if (
            this.detailData[i].status == 4 ||
            this.detailData[i].status == 3
          ) {
            this.detailData[i]["unpaid"] = 0;
          }
          if (this.detailData[i].status == 5) {
            this.detailData[i]["unpaid"] =
              this.detailData[i].poTotal - this.detailData[i].prePayFee;
          }
          if (
            this.detailData[i].status == 1 ||
            this.detailData[i].status == 2
          ) {
            this.detailData[i]["unpaid"] = this.detailData[i].poTotal;
          }
        }
        console.log(this.detailData);
      });
    },
    goPage(page) {
      let date = this.dateValue;
      this.currPage = page;
      requestGet("/api/main/report/pomain/main", 
        { time: date,page:page}
      ).then(resp => {
        let res = resp.data;
        this.result = res.details;
        this.detailData = res.details.list;
      });
    }
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
    },
    status(value) {
      if (value == 1) {
        return "新增";
      }
      if (value == 2) {
        return "已收货";
      }
      if (value == 3) {
        return "已付款";
      }
      if (value == 4) {
        return "已了结";
      }
      if (value == 5) {
        return "已预付";
      }
    }
  }
};
</script>
<style scoped>
.vcipt {
  width: 217px;
}
h3 {
  text-align: center;
  margin: 10px 0 10px 0;
}
</style>