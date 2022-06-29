import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'test-work';
  dataList: any;
  actualPage: number = 1;
  totalPage: number = 1;
  itemPerPage: number = 20;
  arrayShow: any[] = [];
  hourAsc: boolean = false;
  
  // Pie
  public pieChartData: ChartData<'pie', number[], any | any[]> = {
    labels: [ [] ],
    datasets: [ {
      data: [  ]
    } ]
  };
  public pieChartType: ChartType = 'pie';
  

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getData().subscribe((data: any)=>{
	  if (data) {
		  for (var z=0; data.length > z; z++) {
			data[z]['hours'] = 0;
		  }
		  let tempArray = [];
		  for (var i=0; data.length > i; i++) {
		  if(data[i]['EmployeeName']) {
			if (tempArray.length == 0) {
				tempArray.push(data[i]);
			} else {
				let find = false;
				for (var j=0; tempArray.length > j; j++) {
					if (data[i]['EmployeeName'] == tempArray[j]['EmployeeName']) {
						find = true;
						let hoursTemp = tempArray[j]['hours'] + (this.diff_hours(data[i].EndTimeUtc, data[i].StarTimeUtc));
						tempArray[j]['hours'] = hoursTemp;
					}
				}
				if (!find) {
					tempArray.push(data[i]);
				}
			}
		  }
		  }
		  console.log(tempArray);
		  this.dataList = tempArray;
		  this.orderTable(1);
	  }
    })
  }
  
  variablePagination() {
	if (this.dataList) {
		let pages = this.dataList.length/this.itemPerPage;
		if(pages > 1) {
			this.totalPage = Math.ceil(pages);
			let ini = 0;
			if (this.totalPage == 1) {
				ini = this.itemPerPage*this.actualPage;
			}
			let arrayTemp = [];
			if (this.dataList.length > this.itemPerPage) {
				arrayTemp = this.dataList.slice(ini, ini+this.itemPerPage);
			} else {
				arrayTemp = this.dataList;
			}
			this.arrayShow = arrayTemp;
		} else {
			this.totalPage = 1;
			let arrayTemp = this.dataList;
			this.arrayShow = arrayTemp;
		}
		let names = [];
		let dataHours = [];
		
		for (var i=0; this.arrayShow.length > i; i++) {
			names.push(this.arrayShow[i].EmployeeName);
			dataHours.push(this.arrayShow[i].hours);
		}
		this.pieChartData = {
			labels: names ,
			datasets: [ {
			  data: dataHours
			} ]
	    }
	}
  }
  
  nextPage() {
	if (
	this.actualPage < this.totalPage && this.actualPage != this.totalPage-1
	) {
		this.actualPage = this.actualPage + 1;
		this.variablePagination();
	}
  }

  beforePage() {
	if (this.actualPage > 1) {
		this.actualPage = this.actualPage - 1;
		this.variablePagination();
	}
  }
  
  diff_hours(dt2: any, dt1: any)
	{
		let dt1Ini = new Date(dt1);
		let dt2End = new Date(dt2);
		var diff =(dt2End.getTime() - dt1Ini.getTime()) / 1000;
		diff /= (60 * 60);
		return Math.abs(Math.round(diff));
	}
	
	orderTable(typeOrder: number) {
		if (this.dataList) {
			let tempArray: any[] = this.dataList;
			if (typeOrder == 1) {
				this.hourAsc = true;
				tempArray.sort((a, b) => {
				  if(a["hours"] < b["hours"]) {
					return 1;
				  } else if(a["hours"] > b["hours"]) {
					return -1;
				  } else {
					return 0;
				  }
				});
			} else {
				this.hourAsc = false;
				tempArray.sort((a, b) => {
				  if(a["hours"] > b["hours"]) {
					return 1;
				  } else if(a["hours"] < b["hours"]) {
					return -1;
				  } else {
					return 0;
				  }
				});
			}
			this.dataList = tempArray;
		}
	  this.variablePagination();
	}
  
}
