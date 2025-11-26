
import type { RecordModel } from 'pocketbase';

export interface User extends RecordModel {
    name?: string;
    avatar?: string;
    phone?: number;
    postalCode?: string;
    Student?: boolean;
}

export interface Feed extends RecordModel {
    Title?: string;
    DryMatter?: number;
    Fat?: number;
    CrudeFiber?: number;
    Starch?: number;
    Ash?: number;
    Calcium?: number;
    Phosphorus?: number;
    Potassium?: number;
    Sodium?: number;
    DE?: number;
    DEruminants?: number;
    MEruminants?: number;
    NElactose?: number;
    NEmeat?: number;
    NMLruminants?: number;
    DEswine?: number;
    MEswine?: number;
    CEswine?: number;
    MEpoultry?: number;
    CrudeProtein?: number;
    DCPruminants?: number;
    DCPswine?: number;
    Lysine?: number;
    Methionine?: number;
    MethiCystine?: number;
    Threonine?: number;
    Tryptophan?: number;
    Isoleucine?: number;
    Leucine?: number;
    Valine?: number;
    Phenylalanine?: number;
    Histidine?: number;
    Arginine?: number;
    Glycine?: number;

    // Relation to users
    user?: string;

    // App specific (not in DB schema directly but used in logic)
    weight?: number;
    ratio?: number;
    price?: number;
    public?: boolean;
    mix?: boolean;
}

export interface Orology extends RecordModel {
    Title?: string;
    gr?: string;
    eng?: string;
    units?: string;
    labelgr?: string;
    cat?: string;
}

export interface TableState {
	ratios?:boolean;
	selfeeds: Feed[];
	extraCols: string[];
};

export interface State extends RecordModel {
    rationName: string;
    producerName: string;
    tableState: TableState; // stored as JSON in DB
    date?: string;
    user?: string;
    totalWeight: number;

    // App specific
    options?: Option[];
}

export interface Requirement extends RecordModel {
    requirements?: AnimalReqs; // JSON
    user?: string;
    Title?: string;
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

// Mapping Column to Orology for compatibility if needed, but Column is mostly UI
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
