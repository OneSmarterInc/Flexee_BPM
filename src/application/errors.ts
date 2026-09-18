import {ZodError} from 'zod';

export function studentErrorMessage(error:unknown){
 if(!(error instanceof ZodError))return error instanceof Error?error.message:'Request failed';
 const issue=error.issues[0],field=issue.path.at(-1),name=typeof field==='string'?field.replaceAll('_',' '):'value';
 if(/integer|whole number|expected int/i.test(issue.message))return 'This value must be a whole number.';
 if(issue.code==='invalid_type'){
  const expected=(issue as {expected?:string}).expected;
  if(expected==='number')return `Please enter a valid number for ${name}.`;
  if(expected==='string')return `Please enter a value for ${name}.`;
  return `Please enter a valid value for ${name}.`;
 }
 if(issue.code==='invalid_value')return `Please choose one of the available options for ${name}.`;
 if(issue.code==='too_small'&&'origin' in issue&&issue.origin==='string')return `Please enter a value for ${name}.`;
 return issue.message||`Please check ${name} and try again.`;
}
