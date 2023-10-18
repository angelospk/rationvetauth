export interface State{
   tableState:TableState
    rationName:string,
    producerName: string,
    options?:Option[],
	date?:string,
	user?:string,
	updated?:string,
	id?:string
}
export interface Feed {
	id?: string;
	Title?: string;
	weight?: number;
	user?: string;
	updated?: string;
	// Add more fields as necessary
};

export interface TableState {
	selfeeds: Feed[];
	extraCols: string[];
};
export interface Column {
	Title: string,
	gr?: string,
	units?: string,
	labelgr?: string,
	cat?:string
	// Add more fields as necessary
};
export interface Option{
    label:string,
    visible:true
}