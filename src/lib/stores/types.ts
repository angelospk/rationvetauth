
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
export interface AnimalInfo{
	animal:string
	type:{selection:string, subselection:string}
}
export interface Form{
    success:true,
    message?:string,
    requirements?:object
  }
export interface Feed {
	id?: string;
	Title?: string;
	weight?: number;
	user?: string;
	ratio?:number;
	updated?: string;
	price?:number;
	// Add more fields as necessary
};
export interface Req{
	Title: string;
	type: string;
	value:number;
	topValue?:number;
	}
export interface AnimalReqs{
	reqs: Req[];
	fractions: object;
}

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