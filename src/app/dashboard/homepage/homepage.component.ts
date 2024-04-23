import { Component, OnInit, inject, TemplateRef } from '@angular/core';
import { AgChartOptions, PixelSize } from "ag-charts-community";
import { AgBarSeriesOptions } from 'ag-grid-enterprise';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { JobApplicationsService } from '../../core/services/job-applications.service';
import { JobApplication } from '../../core/models/job-application.model';


interface IData {
    category: string;
    count: number;
}
@Component({
    selector: 'jobber-homepage',
    templateUrl: './homepage.component.html',
    styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {

    data: Observable<JobApplication[]> | undefined;
    private modalService = inject(NgbModal);
    public chartOptions: AgChartOptions;
    constructor(
        private jobApplicationsService: JobApplicationsService,
    ){
        this.chartOptions = {
            title: {
                text: "Job Application Analytics"
            },
            width: 800 as PixelSize,
            height: 400 as PixelSize,
            data: [
                { category: 'Bookmarked', count: 25 },
                { category: 'Applied', count: 10 },
                { category: 'Applying', count: 5 },
                { category: 'Interviewing', count: 15 },
                { category: 'Negotiating', count: 20 },
                { category: 'Accepted', count: 30 },
                { category: 'Declined', count: 10 },
                { category: 'Rejected', count: 5 },
                { category: 'Archived', count: 2 }
                // ... other categories
            ] as IData[],
            series: [
                {
                    type: "bar",
                    direction: "horizontal",
                    xKey: "category",
                    yKey: "count",
                    cornerRadius: 10,
                    fill: "#211c19"
                } as AgBarSeriesOptions
            ]
        }
    }
    
    openSm(content: TemplateRef<any>) {
        this.modalService.open(content, { size: 'sm' });
    }
    ngOnInit() {
        this.data = this.jobApplicationsService.callGetJobApplications();
        this.data.subscribe(data => {
            this.processData(data); // Call the function after receiving data
        });
        
    }
    processData(data: JobApplication[]): void {
        const statusCounts: { [status: string]: number } = {};
        data.forEach(application => {
            const status = application.status; // Assuming "status" is a property in JobApplication
            if (!statusCounts[status]) {
                statusCounts[status] = 0;
            }
            statusCounts[status]++;
        });
      
        console.log("Status Counts:");
        console.table(statusCounts); // Use console.table for a formatted output
    }
}