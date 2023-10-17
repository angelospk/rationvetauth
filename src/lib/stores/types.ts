export interface State{
    feeds:any[],
    options:any[],
    rationName:string,
    producerName: string
}
export interface Feed {
	id?: number;
	Title: string;
	weight?: number;
	// Add more fields as necessary
};

export interface TableState {
	selfeeds: Feed[];
	extraCols: string[];
};
export interface Column {
	Title: string;
	gr?: string;
	units?: string;
	// Add more fields as necessary
};
