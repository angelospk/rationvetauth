export interface State{
   tableState:TableState
    rationName:string,
    producerName: string,
    options?:Option[],
	date?:string,
	user?:string
}
export interface Feed {
	id?: string;
	Title?: string;
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
export interface Option{
    label:string,
    visible:true
}