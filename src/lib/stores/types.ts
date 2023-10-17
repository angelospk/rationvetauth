export interface State{
   ts:TableState
    rationName:string,
    producerName: string,
    options?:Option[]
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