const assert = require('assert');
const Immutable = require('../dist/immutablify.js');
describe('Immutablify', () => {
    class Player extends Immutable {
        constructor() {
            super({hp: 10,maxHp: 10, atk: 10, def: 10});
        }
        levelUp() {
            return this.update(['hp', 'maxHp', 'atk', 'def'], bef => bef + 3);
        }
        damage(damage) {
            return this.set('hp', this.get('hp') - damage);
        }
    }
    describe('#get()', () => {
        it('should return notSetValue if it doesn\'t has the key', () => {
            const obj = new Immutable({a: 10, b: 20, c: 30});
            assert.equal(10, obj.get('a'));
            assert.equal('foo', obj.get('d', 'foo'));

            const obj2 = obj.delete('a');
            assert.equal('foo', obj2.get('a', 'foo'));
        });
    });
    describe('#set()', () => {
        it('shouldn\'t change itself', () => {
            const obj = new Immutable({});
            assert.equal(Immutable, obj.set('a', 'hoge').constructor);
            const me = new Player();
            const statuses = [me, me.levelUp(), me.damage(5), me.levelUp().damage(5)];
            assert.equal(Player, me.constructor);
            assert.equal(Player, me.levelUp().constructor);

            assert.equal(10, statuses[0].get('hp'));
            assert.equal(10, statuses[0].get('maxHp'));
            assert.equal(10, statuses[0].get('atk'));
            assert.equal(10, statuses[0].get('def'));

            assert.equal(13, statuses[1].get('hp'));
            assert.equal(13, statuses[1].get('maxHp'));
            assert.equal(13, statuses[1].get('atk'));
            assert.equal(13, statuses[1].get('def'));

            assert.equal(5, statuses[2].get('hp'));
            assert.equal(10, statuses[2].get('maxHp'));
            assert.equal(10, statuses[2].get('atk'));
            assert.equal(10, statuses[2].get('def'));

            assert.equal(8, statuses[3].get('hp'));
            assert.equal(13, statuses[3].get('maxHp'));
            assert.equal(13, statuses[3].get('atk'));
            assert.equal(13, statuses[3].get('def'));
        });
    });
    describe('#merge()', () => {
        it('should merge itself with the argument', () => {
            const one = new Immutable({a: 10, b: 20, c: 30}),
                two = new Immutable({b: 40, a: 50, d: 60}),
                three = one.merge(two),
                four = two.merge(one),
                five = new Immutable({a: 30, e: 190}).merge(three);
            assert.equal(50, three.get('a'));
            assert.equal(40, three.get('b'));
            assert.equal(30, three.get('c'));
            assert.equal(60, three.get('d'));

            assert.equal(10, four.get('a'));
            assert.equal(20, four.get('b'));
            assert.equal(30, four.get('c'));
            assert.equal(60, four.get('d'));

            assert.equal(50, five.get('a'));
            assert.equal(40, five.get('b'));
            assert.equal(30, five.get('c'));
            assert.equal(60, five.get('d'));
            assert.equal(190, five.get('e'));

            const flattened = new Immutable({a: 10}).set('b', 20).set('c', 30).set('d', 40).set('e', 50).set('f', 60).merge(three);
        });
    });
    describe('#delete()', () => {
        it('should delete the value', () => {
            const one = new Immutable({a: 10, b: 20, c: 30});
            const one2 = one.delete('a');
            const two = new Immutable({a: 50, b: 40, d: 60});
            const three = one2.merge(two).delete('a');
            const four = three.set('b', 30);
            const five = four.set('moge', 'fooo').set('moge', 'fooo').set('moge', 'fooo');

            assert.equal(10, one.get('a'));
            assert.equal(undefined, one2.get('a'));
            assert.equal(50, two.get('a'));
            assert.equal(undefined, three.get('a'));
            assert.equal(undefined, four.get('a'));
            assert.equal(undefined, five.get('a'));
        });
    });
});