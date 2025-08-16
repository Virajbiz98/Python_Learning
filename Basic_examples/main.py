def merge_arrays(arrayA, arrayB):
    return sorted(set(arrayA + arrayB))


a = [1,2,3,4,5,6]
b = [4,,3,3,5,6,7,8,9]
c = merge_arrays(a,b)
print(c)
