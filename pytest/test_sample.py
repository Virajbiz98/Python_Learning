# def test_addition():
#    assert 2 + 2 == 4 


# def test_subtraction():
#     assert 10 - 6 == 8

import pytest 

@pytest.fixture
def sample_data():
    return [1,2,3,]

def test_sum(sample_data):
    assert sum(sample_data) == 6

@pytest.mark.parametrize("a, b, exepected", [(1,2,3), (2,3,5), (3,4,7)])
def test_addition(a, b, expected):
    assert a + b == expected