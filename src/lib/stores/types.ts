
export interface State{
   tableState:TableState
    rationName:string,
    producerName: string,
    options?:Option[],
	date?:string,
	user?:string,
	updated?:string,
	id?:string
	totalWeight:number
}
export type hasFeedConstraint={
	Title:string
	has:true
	low:number
	high:number
}
export type hasntFeedConstraint={
	Title:string
	has:false
}
export type FeedConstraint=hasFeedConstraint|hasntFeedConstraint

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
	public?:boolean;
	mix?:boolean
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
	ratios?:boolean;
	selfeeds: Feed[];
	extraCols: string[];
};
export interface Column {
	Title: string,
	gr?: string,
	units?: string,
	labelgr?: string,
	cat?:string
};
export interface Option{
    label:string,
    visible:true
}