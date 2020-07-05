<template>
  <div>
    <el-table :data="tableData" stripe style="100%">
      <el-table-column prop="ordinal" label="序号">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productCode" label="产品编号">
        <template slot-scope="scope">
          <span>{{scope.row.productCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="产品名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="num" label="当前库存">
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
      <el-table-column prop="opp" label="操作">
        <template slot-scope="scope">
          <router-link to="/stock/updatestock">
            <el-button type="primary" class="btn" @click="checkStock(scope.$index, scope.row)">盘点</el-button>
          </router-link>
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
import { requestPost } from "../../utils/http";
export default {
  data() {
    return {
      tableData: [],
      currPage: 1,
      result: ""
    };
  },
  created() {
    requestGet("/api/main/sell/product/show").then(resp => {
      this.result = resp.data;
      this.tableData = resp.data.list;
      console.log(this.tableData);
    });
  },
  methods: {
    checkStock(index, row) {
      console.log("index", index, "row", row);
      sessionStorage.setItem("productCode", row.productCode);
      sessionStorage.setItem("originNum", row.num);
    },
    goPage(page) {
      this.currPage = page;
      requestGet("/api/main/sell/product/show", {page:page}).then(
        resp => {
          this.result = resp.data;
          this.tableData = this.result.list;
        }
      );
    }
  }
};
</script>