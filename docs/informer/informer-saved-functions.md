---
id: informer-saved-functions
title: Informer Saved Functions
sidebar_label: Informer Saved Functions
---

Saved Functions are functions that are added to an Informer site via the Administration/Saved Functions area.

Users can then call these function in their Datasets to perform whatever action they were designed to do.

All functions created by Naviga staff will be located in the **naviga** namespace.

If a function in this list doesn't exist in your Informer system, you can create it by logging into Informer and going to the Administration page, then clicking on the Saved Functions icon.

When you are in the **Saved Functions** area, you will see a **New Function** button in the left sidebar.

After clicking on this button you will be presented with a dialog to fill out.  Simply fill it out with the details give in the **Create Function** section for each of the below functions.

## calculateAggregates - Create Function

- **Function name:** calculateAggregates

- **Namespace:** naviga

- **Description:** Create keys on the local object to aggregate fields

- **Parameters:**

  | Data Type | Variable name    | Label            | Sample                           |
  | --------- | ---------------- | ---------------- | -------------------------------- |
  | Any       | aggrConfigObject | AggrConfigObject | { $local, groupKeys, groupAggr } |

**Function Body**

```javascript
const groupKeys = aggrConfigObject.groupKeys || [];
const groupAggr = aggrConfigObject.groupAggr || [];
const localHold = aggrConfigObject.$local;
//---------------------------------------------------
//Loop through the groupKeys Array
groupKeys.forEach((groupKeyObj) => {
  //Create the groupInit object
  groupInit = {
    GroupSet: false,
    ...groupAggr.reduce(
      (init, obj) => ({ ...init, [obj.name]: obj.initValue }),
      {}
    ),
  };

  groupKey = groupKeyObj.groupKey;
  // Initialize the groupKey on the $local object
  // To accomodate dynamic groupAggr values, spreading new groupInit first, then any existing value in local for given groupKey
  localHold[groupKey] = { ...groupInit, ...localHold[groupKey] };
  //---------------------------
  // Loop through groupAggr Array and perform the aggregation
  groupAggr.forEach((aggrObj) => {
    localHold[groupKey][aggrObj.name] =
      localHold[groupKey][aggrObj.name] + aggrObj.value;
  });
  //---------------------------
});
//---------------------------------------------------
return localHold;
```



## calculateAggregates - Usage

This function is called with a configuration object that will define fields to aggregate and the groupings to aggregate those fields by.

For example, if you had the following data, but wanted a field that aggregated by Year-Month and Rep.

This is the starting dataset

| Year-Month | Rep  | Amount |
| ---------- | ---- | ------ |
| 2020-01    | ABA  | 50     |
| 2020-01    | ABA  | 100    |
| 2020-01    | MRM  | 200    |
| 2020-02    | MRM  | 100    |
| 2020-02    | ABA  | 50     |
| 2020-02    | ABA  | 10     |
| 2020-03    | MRM  | 100    |

After you follow the instructions below, because the function call is just the first step.

Your result could be:

| Year-Month | Rep  | Amount | AggAmount |
| ---------- | ---- | ------ | --------- |
| 2020-01    | ABA  | 50     | 150       |
| 2020-01    | ABA  | 100    |           |
| 2020-01    | MRM  | 200    | 300       |
| 2020-02    | MRM  | 100    |           |
| 2020-02    | ABA  | 50     | 60        |
| 2020-02    | ABA  | 10     |           |
| 2020-03    | MRM  | 100    | 100       |

This is useful in reports requiring calculations to be done on aggregated amounts like percentages, etc.

### Calling the function

The function accepts a single object as a parameter. That object has the following shape:

```javascript
{
  $local, //This is the local object
  groupKeys,
  groupAggr,
}
```

**groupKeys** defines the aggregation groups that you are trying to define. It is an **array** of objects, with each object defining an aggregation key

For example, if you wanted to aggregate on Year and Rep, you have to define two keys, one for **Year**, the other for **Year-Rep**. Usually your aggregation groups are hierarchical.

Here is the **groupKeys** array you would create:

```javascript
groupKeys = [
  {
    name: "Year",
    groupKey: $record.Year,
  },
  {
    name: "Year_Rep",
    groupKey: `${$record.Year}-${$record.salesrepId}`,
  },
];
```

The second key of the parameter is the **groupAggr** array of objects. Each object in this array defines one of the aggregations that you want to perform.

In the example below, we have defined two aggregations by assigning the following keys to each object in the array:

- name - A name that will be used to store the aggregation on the \$local object.
- initValue - The initial value of the aggregation. This is usually zero.
- value - This is the value that you are aggregating.

```javascript
groupAggr = [
  {
    name: "sumNet",
    initValue: 0,
    value: $record.orderNetAmt,
  },
  {
    name: "sumInvoice",
    initValue: 0,
    value: $record.invoiceID_assoc_invamount,
  },
];
```

### Post Aggregate Powerscript

This is where you will perform the calculations that you needed the aggregates for.

> This Powerscript must run AFTER a Flush flow step

To do this, you will use the values that were stored on the \$local object in the preAggregation function.

**\$local Object Fields:**

Let's look at an example. You are calculating aggregates for **IssueYear** and **IssueYear-RepId**.

This means you have two groupKeys for every record. If we have data that looks like this:

| Issue Year | Rep Id | Net Revenue | Invoice Revenue |
| ---------- | ------ | ----------- | --------------- |
| 2019       | MM     | 100         | 75              |
| 2019       | SW     | 50          | 50              |
| 2020       | MM     | 125         | 100             |
| 2020       | SW     | 25          | 20              |
| 2020       | TE     | 75          | 75              |

Your groupKeys for **IssueYear** will be "2019", "2020"
Your groupKeys for **IssueYear-RepId** will be "2019-MM", "2019-SW", "2020-MM", "2020-SW", "2020-TE"

The preAggregation function creates a key on the \$local object for each one of these groups that you can then access in your post aggregation Powerscript.

Here is an example of the \$local object would hold for the 2019 IssueYear groupkey

```javascript
$local = {
  2019: {
    sumNet: 125322,
    sumInvoice: 105423,
    GroupSet: false,
  },
};
```

The GroupSet can be used if you only want the total to show up once in your dataset for each groupKey. This allows you to use the Total aggregation function when building pivot tables, etc.

Here is example code of how you could implement the Post Aggregate code:

```javascript
// Get the year of the issue date
vIssueYear = $record.issueYear;

// Define the groupKey to be used across aggregates
// !!!!Must be the same as those defined in the first Powerscript
groupKey1 = `${vIssueYear}`;
groupKey2 = `${vIssueYear}-${$record.salesrep_id_assoc_id}`;

// GROUP KEY 1
$record.groupKey1 = groupKey1; // If you want a record in your data showing the groupKey for the record
if (!$local[groupKey1].GroupSet) {
  $record.RepNetByYear_Total = $local[groupKey1].sumNet;
  $record.RepInvTotalForYear_Total = $local[groupKey1].sumInvoice;
  $record.NetInv_VarianceByYear_Total =
    $local[groupKey1].sumNet - $local[groupKey1].sumInvoice;
  $local[groupKey1].GroupSet = true; //Setting to true means we will not excute this code again during the load.
}
// GROUP KEY 2
$record.groupKey2 = groupKey2;
if (!$local[groupKey2].GroupSet) {
  $record.RepNetByYearRep_Total = $local[groupKey2].sumNet;
  $record.RepInvTotalForRepYear_Total = $local[groupKey2].sumInvoice;
  $record.NetInv_VarianceByYearRep_Total =
    $local[groupKey2].sumNet - $local[groupKey2].sumInvoice;
  $local[groupKey2].GroupSet = true;
}
```



---

## sumMultiValuedField - Create Function

- **Function name:** sumMultiValuedField

- **Namespace:** naviga

- **Description:** Accepts an array (multivalued field) and returns the sum of the elements.  Non numeric values will be assumed to be zero.

- **Parameters:**

  | Data Type | Variable name | Label              | Sample |
  | --------- | ------------- | ------------------ | ------ |
  | Any       | mvField       | Multi Valued Field |        |

**Function Body**

```javascript
// Check if item passed is an array, if not return zero or a number if a number was passed
if (!Array.isArray(mvField)) {
  return returnANumber(mvField);
}

// field is an array
total = mvField.reduce((tot, val) => tot + returnANumber(val), 0);

return total;
//---------------------------
//--Helper Function ---------
function returnANumber(numberIn) {
  // If a date is passed return 0 otherwise dates get converted to unix time value
  numberIn = Object.prototype.toString.call(numberIn) === '[object Date]' ? 0 : numberIn
  const parsedNumber = Number(numberIn);
  if (isNaN(parsedNumber)) {
    return 0;
  }
  return parsedNumber;
}
```

## sumMultiValuedField - Usage

Accepts an array (multivalued field) and returns the sum of the values.

If the passed field is not an array, zero will be returned.

If the any of the values are not numeric they will be ignored, but all numeric values will be summed and a total returned.

**Function Syntax**

```javascript
sumMultiValuedField(field)
```

**Sample Input and Output**

| Input     | Output |
| --------- | ------ |
| [1,2,3,4] | 10     |
| [a, b, c] | 0      |
| [1, b, 3] | 4      |
| 15        | 15     |
| Test      | 0      |



---

## multiValuedToString - Create Function

- **Function name:** multiValuedToString

- **Namespace:** naviga

- **Description:** Accepts an array (multivalued field) and returns a string, delimited by comma (default) or a delimiter passed in by user.  Can also be made unique.

- **Parameters:**

  | Data Type | Variable name | Label              | Sample          |
  | --------- | ------------- | ------------------ | --------------- |
  | Any       | mvField       | Multi Valued Field |                 |
  | String    | delimiter     | delimiter          | ',' (default)   |
  | Any       | makeDistinct  | Make Distinct      | false (default) |

**Function Body**

```javascript
delimiter = delimiter || ','
makeDistinct = makeDistinct || false

// If passed mvField is NOT an array, then return mvField
if (!Array.isArray(mvField)) {
  return mvField;
}

//Need to convert elements to string because I found
//some text value are represented as an object type
//so the distinct options wouldn't work.
mvField = mvField.map((el) => el.toString());

// If makeDistinct flag set, make distinct using Set
if (makeDistinct) {
  // Use the JS Set to make sure we have a unique array of values
  mvField = [...new Set(mvField)];
}

// reduce to a single line of text
const finalString = mvField.reduce((final, val) => {
  if (final) {
    return `${final}${delimiter}${val}`;
  } else {
    return val;
  }
}, undefined);

return finalString;
```

## multiValuedToString - Usage

This function will take a multi valued field (array) and return a concatenated string of the contents of the passed field.

For example if you have a multi valued field **$record.mvField**, that is populated with these values:

`['Rep1', 'Rep2', 'Rep3']`

And you call the function as follows:

`naviga.multiValuedToString($record.mvField)`

You will the following returned:

``'Rep1,Rep2,Rep3'`

**Function Syntax**

```javascript
// There are three parameters that can be passed, but the first is the only required parameter:
multiValuedToString(field [, delimiter=',', distinct=false])
```

Along with the field, you can pass the delimiter that you want as well as a flag to have the returned string only include unique values.

**Sample Input and Output**

| field                | delimiter | distinct | Output    |
| -------------------- | --------- | -------- | --------- |
| [1,2,2,4]            | '-'       | false    | '1-2-2-4' |
| [1,2,2,4]            | '-'       | true     | '1-2-4'   |
| ['a', 'b', 'b', 'c'] | ';'       | true     | 'a;b;c'   |
| ['a', 'b', 'b', 'c'] | ';'       | false    | 'a;b;b;c' |